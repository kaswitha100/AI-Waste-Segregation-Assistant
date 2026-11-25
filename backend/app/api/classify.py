import base64
import uuid
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, File, UploadFile, HTTPException, status, Depends
from pydantic import BaseModel

from app.core.dependencies import get_optional_current_user
from app.db.database import get_database
from app.ml.classifier import classify_waste_image
from app.models.classification import ClassificationResponse, HistoryRecordResponse
from app.models.user import UserResponse
from app.ml.disposal_guide import GUIDELINES

router = APIRouter(prefix="/classify", tags=["Waste Classification"])

class CameraCaptureRequest(BaseModel):
    image_base64: str
    notes: Optional[str] = None

@router.post("/upload", response_model=ClassificationResponse)
async def classify_upload_image(
    file: UploadFile = File(...),
    notes: Optional[str] = None,
    current_user: Optional[UserResponse] = Depends(get_optional_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid image (JPEG, PNG, WEBP)."
        )

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty image file.")
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Image size exceeds 10MB limit.")

    # Run AI Classification Pipeline
    result = classify_waste_image(image_bytes)

    # Generate lightweight base64 preview for history display
    preview_base64 = "data:image/jpeg;base64," + base64.b64encode(image_bytes[:500000]).decode("utf-8") if len(image_bytes) < 500000 else None

    # Persist in classification history
    db = get_database()
    history_col = db.get_collection("classifications")
    record_id = str(uuid.uuid4())
    
    history_doc = {
        "_id": record_id,
        "user_id": current_user.id if current_user else None,
        "item_name": result.item_name,
        "category": result.category,
        "confidence": result.confidence,
        "is_uncertain": result.is_uncertain,
        "disposal_guide": result.disposal_guide.model_dump(),
        "image_preview": preview_base64,
        "notes": notes,
        "feedback": None,
        "timestamp": datetime.now(timezone.utc)
    }
    await history_col.insert_one(history_doc)

    # Award eco-points and increment scan count if logged in
    if current_user:
        users_col = db.get_collection("users")
        await users_col.update_one(
            {"_id": current_user.id},
            {
                "$inc": {
                    "scans_count": 1,
                    "eco_points": result.eco_points_earned
                }
            }
        )

    result.id = record_id
    result._id = record_id
    return result


@router.post("/camera", response_model=ClassificationResponse)
async def classify_camera_frame(
    payload: CameraCaptureRequest,
    current_user: Optional[UserResponse] = Depends(get_optional_current_user)
):
    try:
        raw_b64 = payload.image_base64
        if "," in raw_b64:
            raw_b64 = raw_b64.split(",")[1]
        image_bytes = base64.b64decode(raw_b64)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid base64 image data.")

    if len(image_bytes) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty image data.")

    # Run AI Classification Pipeline
    result = classify_waste_image(image_bytes)

    preview_base64 = payload.image_base64 if len(payload.image_base64) < 700000 else None

    # Persist in classification history
    db = get_database()
    history_col = db.get_collection("classifications")
    record_id = str(uuid.uuid4())
    
    history_doc = {
        "_id": record_id,
        "user_id": current_user.id if current_user else None,
        "item_name": result.item_name,
        "category": result.category,
        "confidence": result.confidence,
        "is_uncertain": result.is_uncertain,
        "disposal_guide": result.disposal_guide.model_dump(),
        "image_preview": preview_base64,
        "notes": payload.notes,
        "feedback": None,
        "timestamp": datetime.now(timezone.utc)
    }
    await history_col.insert_one(history_doc)

    # Award eco-points and increment scan count if logged in
    if current_user:
        users_col = db.get_collection("users")
        await users_col.update_one(
            {"_id": current_user.id},
            {
                "$inc": {
                    "scans_count": 1,
                    "eco_points": result.eco_points_earned
                }
            }
        )

    result.id = record_id
    result._id = record_id
    return result


@router.get("/guide")
async def get_waste_guide():
    """
    Returns environmental guidelines and bin classification details.
    """
    return GUIDELINES
