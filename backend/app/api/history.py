from typing import Optional, List
from fastapi import APIRouter, HTTPException, status, Depends, Query
from app.core.dependencies import get_current_user, get_optional_current_user
from app.db.database import get_database
from app.models.classification import HistoryRecordResponse, FeedbackRequest, UserNoteRequest
from app.models.user import UserResponse

router = APIRouter(prefix="/history", tags=["Classification History"])

@router.get("")
async def get_history(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search item name"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: Optional[UserResponse] = Depends(get_optional_current_user)
):
    db = get_database()
    col = db.get_collection("classifications")

    query = {}
    if current_user:
        query["user_id"] = current_user.id
    
    if category and category.lower() != "all":
        query["category"] = category

    if search:
        query["item_name"] = {"$regex": search}

    total_count = await col.count_documents(query)
    
    skip = (page - 1) * limit
    cursor = col.find(query).sort("timestamp", -1).skip(skip).limit(limit)
    raw_docs = await cursor.to_list(length=limit)

    items = []
    for d in raw_docs:
        rec_id = str(d.get("_id") or d.get("id"))
        items.append(
            HistoryRecordResponse(
                id=rec_id,
                _id=rec_id,
                user_id=d.get("user_id"),
                item_name=d.get("item_name", "Unknown Item"),
                category=d.get("category", "Uncertain / Mixed Waste"),
                confidence=d.get("confidence", 0.0),
                is_uncertain=d.get("is_uncertain", False),
                disposal_guide=d.get("disposal_guide"),
                image_preview=d.get("image_preview"),
                notes=d.get("notes"),
                feedback=d.get("feedback"),
                timestamp=d.get("timestamp")
            )
        )

    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "items": items
    }


@router.get("/{record_id}", response_model=HistoryRecordResponse)
async def get_history_detail(
    record_id: str,
    current_user: Optional[UserResponse] = Depends(get_optional_current_user)
):
    db = get_database()
    col = db.get_collection("classifications")
    doc = await col.find_one({"_id": record_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History record not found.")

    if current_user and doc.get("user_id") and doc.get("user_id") != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    rec_id = str(doc.get("_id") or doc.get("id"))
    return HistoryRecordResponse(
        id=rec_id,
        _id=rec_id,
        user_id=doc.get("user_id"),
        item_name=doc.get("item_name"),
        category=doc.get("category"),
        confidence=doc.get("confidence"),
        is_uncertain=doc.get("is_uncertain", False),
        disposal_guide=doc.get("disposal_guide"),
        image_preview=doc.get("image_preview"),
        notes=doc.get("notes"),
        feedback=doc.get("feedback"),
        timestamp=doc.get("timestamp")
    )


@router.post("/{record_id}/feedback")
async def update_history_feedback(
    record_id: str,
    feedback_req: FeedbackRequest,
    current_user: Optional[UserResponse] = Depends(get_optional_current_user)
):
    db = get_database()
    col = db.get_collection("classifications")
    doc = await col.find_one({"_id": record_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found.")

    update_fields = {"feedback": feedback_req.feedback}
    if feedback_req.user_correction:
        update_fields["user_correction"] = feedback_req.user_correction

    await col.update_one({"_id": record_id}, {"$set": update_fields})
    return {"message": "Feedback submitted successfully."}


@router.delete("/{record_id}")
async def delete_history_item(
    record_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    col = db.get_collection("classifications")
    doc = await col.find_one({"_id": record_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Record not found.")

    if doc.get("user_id") != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    await col.delete_one({"_id": record_id})
    return {"message": "Record deleted successfully."}
