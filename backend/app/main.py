import asyncio
import threading
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db.database import get_database
from app.core.security import get_password_hash
from app.ml.classifier import get_ml_model
from app.ml.disposal_guide import get_disposal_guide_for_category

# Routers
from app.api.auth import router as auth_router
from app.api.classify import router as classify_router
from app.api.history import router as history_router
from app.api.analytics import router as analytics_router
from app.api.admin import router as admin_router
from app.api.profile import router as profile_router


async def seed_initial_data():
    """
    Seeds default admin user and sample classification scans if the database is newly created.
    """
    db = get_database()
    users_col = db.get_collection("users")
    classifications_col = db.get_collection("classifications")

    # 1. Seed Admin
    existing_admin = await users_col.find_one({"email": settings.ADMIN_EMAIL.lower()})
    admin_id = str(uuid.uuid4())
    if not existing_admin:
        admin_doc = {
            "_id": admin_id,
            "email": settings.ADMIN_EMAIL.lower(),
            "full_name": "Chief Sustainability Officer",
            "hashed_password": get_password_hash(settings.ADMIN_PASSWORD),
            "role": "admin",
            "eco_points": 450,
            "scans_count": 28,
            "avatar_url": None,
            "bio": "Lead administrator for Waste Segregation and Circular Economy operations.",
            "created_at": datetime.now(timezone.utc)
        }
        await users_col.insert_one(admin_doc)
        print(f"[Seed] Created initial Admin account: {settings.ADMIN_EMAIL}")
    else:
        admin_id = str(existing_admin["_id"])

    # 2. Seed Demo User
    demo_email = "eco.user@example.com"
    existing_user = await users_col.find_one({"email": demo_email})
    demo_id = str(uuid.uuid4())
    if not existing_user:
        demo_doc = {
            "_id": demo_id,
            "email": demo_email,
            "full_name": "Alex Green",
            "hashed_password": get_password_hash("Password123!"),
            "role": "user",
            "eco_points": 180,
            "scans_count": 12,
            "avatar_url": None,
            "bio": "Eco warrior committed to zero-waste urban living.",
            "created_at": datetime.now(timezone.utc)
        }
        await users_col.insert_one(demo_doc)
        print(f"[Seed] Created initial Demo User: {demo_email}")
    else:
        demo_id = str(existing_user["_id"])

    # 3. Seed Initial History Records if empty
    count = await classifications_col.count_documents({})
    if count == 0:
        now = datetime.now(timezone.utc)
        sample_scans = [
            {
                "_id": str(uuid.uuid4()),
                "user_id": demo_id,
                "item_name": "Plastic Bottle",
                "category": "Recyclable Waste",
                "confidence": 0.942,
                "is_uncertain": False,
                "disposal_guide": get_disposal_guide_for_category("Recyclable Waste").model_dump(),
                "image_preview": None,
                "notes": "Rinsed clear water bottle from gym.",
                "feedback": "accurate",
                "timestamp": now - timedelta(days=2, hours=3)
            },
            {
                "_id": str(uuid.uuid4()),
                "user_id": demo_id,
                "item_name": "Banana & Orange Peels",
                "category": "Wet Waste",
                "confidence": 0.915,
                "is_uncertain": False,
                "disposal_guide": get_disposal_guide_for_category("Wet Waste").model_dump(),
                "image_preview": None,
                "notes": "Breakfast smoothie fruit peels.",
                "feedback": "accurate",
                "timestamp": now - timedelta(days=1, hours=5)
            },
            {
                "_id": str(uuid.uuid4()),
                "user_id": demo_id,
                "item_name": "Cardboard Box / Packaging",
                "category": "Recyclable Waste",
                "confidence": 0.887,
                "is_uncertain": False,
                "disposal_guide": get_disposal_guide_for_category("Recyclable Waste").model_dump(),
                "image_preview": None,
                "notes": "E-commerce delivery carton, flattened.",
                "feedback": "accurate",
                "timestamp": now - timedelta(hours=14)
            },
            {
                "_id": str(uuid.uuid4()),
                "user_id": demo_id,
                "item_name": "Batteries (Household / Lithium)",
                "category": "Hazardous Waste",
                "confidence": 0.865,
                "is_uncertain": False,
                "disposal_guide": get_disposal_guide_for_category("Hazardous Waste").model_dump(),
                "image_preview": None,
                "notes": "Exhausted AA remote control batteries taped safely.",
                "feedback": "helpful",
                "timestamp": now - timedelta(hours=6)
            },
            {
                "_id": str(uuid.uuid4()),
                "user_id": demo_id,
                "item_name": "Multi-Layered Snack Wrapper",
                "category": "Dry Waste",
                "confidence": 0.789,
                "is_uncertain": False,
                "disposal_guide": get_disposal_guide_for_category("Dry Waste").model_dump(),
                "image_preview": None,
                "notes": "Potato chip silver foil wrapper.",
                "feedback": "accurate",
                "timestamp": now - timedelta(hours=2)
            }
        ]
        for s in sample_scans:
            await classifications_col.insert_one(s)
        print(f"[Seed] Injected {len(sample_scans)} initial waste classification records.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB and seed initial accounts
    db = get_database()
    await db.connect()
    await seed_initial_data()
    
    # Warmup ML model in background thread
    threading.Thread(target=get_ml_model, daemon=True).start()
    
    yield
    # Shutdown
    await db.disconnect()


app = FastAPI(
    title="AI Waste Segregation Assistant API",
    description="Intelligent computer vision API for real-time waste classification, segregation guidance, and eco analytics.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(classify_router, prefix="/api/v1")
app.include_router(history_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(profile_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "app": "AI Waste Segregation Assistant API",
        "status": "online",
        "version": "1.0.0",
        "documentation": "/docs"
    }


@app.get("/health")
async def health_check():
    db = get_database()
    return {
        "status": "healthy",
        "database": "connected" if db.is_connected else "fallback_active",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
