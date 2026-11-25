from fastapi import APIRouter, HTTPException, status, Depends
from app.core.dependencies import get_current_user
from app.core.security import verify_password, get_password_hash
from app.db.database import get_database
from app.models.user import UserResponse, UserProfileUpdate, PasswordChangeRequest

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("", response_model=UserResponse)
async def get_profile(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@router.put("", response_model=UserResponse)
async def update_profile(
    profile_data: UserProfileUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    users_col = db.get_collection("users")

    update_fields = {}
    if profile_data.full_name is not None:
        update_fields["full_name"] = profile_data.full_name.strip()
    if profile_data.avatar_url is not None:
        update_fields["avatar_url"] = profile_data.avatar_url
    if profile_data.bio is not None:
        update_fields["bio"] = profile_data.bio

    if update_fields:
        await users_col.update_one({"_id": current_user.id}, {"$set": update_fields})

    updated_doc = await users_col.find_one({"_id": current_user.id})
    return UserResponse(
        id=str(updated_doc["_id"]),
        email=updated_doc["email"],
        full_name=updated_doc.get("full_name", ""),
        role=updated_doc.get("role", "user"),
        eco_points=updated_doc.get("eco_points", 0),
        scans_count=updated_doc.get("scans_count", 0),
        avatar_url=updated_doc.get("avatar_url"),
        bio=updated_doc.get("bio"),
        created_at=updated_doc.get("created_at")
    )

@router.post("/change-password")
async def change_password(
    pwd_data: PasswordChangeRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    users_col = db.get_collection("users")
    user_doc = await users_col.find_one({"_id": current_user.id})

    if not verify_password(pwd_data.old_password, user_doc.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password entered is incorrect."
        )

    new_hash = get_password_hash(pwd_data.new_password)
    await users_col.update_one({"_id": current_user.id}, {"$set": {"hashed_password": new_hash}})

    return {"message": "Password updated successfully."}
