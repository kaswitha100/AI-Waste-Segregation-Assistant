import asyncio
import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
import motor.motor_asyncio
from app.config import settings

class ResilientAsyncCollection:
    """
    A lightweight, asynchronous MongoDB-compatible collection for local/standalone fallback
    when a live MongoDB instance is not connected. It persists data to a local JSON file
    and implements standard async MongoDB collection methods.
    """
    def __init__(self, name: str, data_dir: str = "data"):
        self.name = name
        self.data_dir = data_dir
        os.makedirs(self.data_dir, exist_ok=True)
        self.filepath = os.path.join(self.data_dir, f"{name}.json")
        self._lock = asyncio.Lock()
        self._items: Dict[str, Dict[str, Any]] = {}
        self._load()

    def _load(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r", encoding="utf-8") as f:
                    docs = json.load(f)
                    self._items = {d["_id"]: d for d in docs if "_id" in d}
            except Exception:
                self._items = {}
        else:
            self._items = {}

    def _save(self):
        try:
            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump(list(self._items.values()), f, default=str, indent=2)
        except Exception as e:
            print(f"[FallbackDB Error saving {self.name}]: {e}")

    @staticmethod
    def _matches_query(doc: Dict[str, Any], query: Dict[str, Any]) -> bool:
        if not query:
            return True

        # Handle top-level $or
        if "$or" in query:
            sub_queries = query["$or"]
            or_match = False
            for sq in sub_queries:
                if ResilientAsyncCollection._matches_query(doc, sq):
                    or_match = True
                    break
            if not or_match:
                return False

        # Handle field-level conditions
        for k, v in query.items():
            if k == "$or":
                continue

            doc_val = doc.get(k)
            if isinstance(v, dict):
                if "$regex" in v:
                    regex_val = str(v["$regex"]).lower()
                    if regex_val not in str(doc_val or "").lower():
                        return False
                if "$in" in v:
                    if doc_val not in v["$in"]:
                        return False
                if "$ne" in v:
                    if doc_val == v["$ne"]:
                        return False
            else:
                if doc_val != v:
                    return False

        return True

    async def insert_one(self, document: Dict[str, Any]):
        async with self._lock:
            doc = dict(document)
            if "_id" not in doc:
                doc["_id"] = str(uuid.uuid4())
            elif isinstance(doc["_id"], uuid.UUID):
                doc["_id"] = str(doc["_id"])
            self._items[str(doc["_id"])] = doc
            self._save()
            return type("InsertOneResult", (), {"inserted_id": doc["_id"]})()

    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        async with self._lock:
            for doc in self._items.values():
                if self._matches_query(doc, query):
                    return dict(doc)
            return None

    def find(self, query: Optional[Dict[str, Any]] = None):
        return ResilientAsyncCursor(self, query or {})

    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        async with self._lock:
            for doc_id, doc in self._items.items():
                if self._matches_query(doc, query):
                    if "$set" in update:
                        doc.update(update["$set"])
                    if "$inc" in update:
                        for ik, iv in update["$inc"].items():
                            doc[ik] = doc.get(ik, 0) + iv
                    self._save()
                    return type("UpdateResult", (), {"modified_count": 1, "matched_count": 1})()
            return type("UpdateResult", (), {"modified_count": 0, "matched_count": 0})()

    async def delete_one(self, query: Dict[str, Any]):
        async with self._lock:
            for doc_id, doc in list(self._items.items()):
                if self._matches_query(doc, query):
                    del self._items[doc_id]
                    self._save()
                    return type("DeleteResult", (), {"deleted_count": 1})()
            return type("DeleteResult", (), {"deleted_count": 0})()

    async def count_documents(self, query: Optional[Dict[str, Any]] = None) -> int:
        async with self._lock:
            if not query:
                return len(self._items)
            count = 0
            for doc in self._items.values():
                if self._matches_query(doc, query):
                    count += 1
            return count

class ResilientAsyncCursor:
    def __init__(self, collection: ResilientAsyncCollection, query: Dict[str, Any]):
        self.collection = collection
        self.query = query
        self._sort_field = None
        self._sort_dir = 1
        self._skip_val = 0
        self._limit_val = None

    def sort(self, field: str, direction: int = 1):
        self._sort_field = field
        self._sort_dir = direction
        return self

    def skip(self, count: int):
        self._skip_val = count
        return self

    def limit(self, count: int):
        self._limit_val = count
        return self

    async def to_list(self, length: Optional[int] = None) -> List[Dict[str, Any]]:
        async with self.collection._lock:
            results = []
            for doc in self.collection._items.values():
                if self.collection._matches_query(doc, self.query):
                    results.append(dict(doc))

            if self._sort_field:
                reverse = self._sort_dir == -1
                results.sort(key=lambda x: str(x.get(self._sort_field) or ""), reverse=reverse)

            if self._skip_val:
                results = results[self._skip_val:]
            if self._limit_val is not None:
                results = results[:self._limit_val]
            elif length is not None:
                results = results[:length]

            return results


class DatabaseManager:
    def __init__(self):
        self.client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
        self.db = None
        self.is_connected = False
        self.use_fallback = False
        self._fallback_collections: Dict[str, ResilientAsyncCollection] = {}

    async def connect(self):
        try:
            # Try connecting with a 2-second server selection timeout
            self.client = motor.motor_asyncio.AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=2000
            )
            # Ping to verify connection
            await self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.is_connected = True
            self.use_fallback = False
            print(f"[Database] Successfully connected to live MongoDB at {settings.MONGODB_URL}")
        except Exception as e:
            print(f"[Database Warning] Could not connect to live MongoDB: {e}")
            print("[Database] Operating in High-Resilience Fallback mode (persistent local async datastore).")
            self.is_connected = False
            self.use_fallback = True

    async def disconnect(self):
        if self.client:
            self.client.close()
            print("[Database] MongoDB client disconnected.")

    def get_collection(self, collection_name: str):
        if self.is_connected and self.db is not None and not self.use_fallback:
            return self.db[collection_name]
        if collection_name not in self._fallback_collections:
            self._fallback_collections[collection_name] = ResilientAsyncCollection(collection_name)
        return self._fallback_collections[collection_name]

db_manager = DatabaseManager()

def get_database():
    return db_manager
