from datetime import datetime, timezone
import uuid
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user
from app.db.database import get_database
from app.models.user import UserCreate, UserLogin, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    db = get_database()
    users_col = db.get_collection("users")
    
    # Check if user already exists
    existing = await users_col.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    user_doc = {
        "_id": user_id,
        "email": user_in.email.lower(),
        "full_name": user_in.full_name.strip(),
        "hashed_password": get_password_hash(user_in.password),
        "role": "user",
        "eco_points": 0,
        "scans_count": 0,
        "avatar_url": None,
        "bio": "Passionate about waste segregation and sustainable living.",
        "created_at": now
    }
    
    await users_col.insert_one(user_doc)
    
    token = create_access_token({"sub": user_id, "email": user_in.email.lower(), "role": "user"})
    user_response = UserResponse(
        id=user_id,
        email=user_doc["email"],
        full_name=user_doc["full_name"],
        role=user_doc["role"],
        eco_points=user_doc["eco_points"],
        scans_count=user_doc["scans_count"],
        avatar_url=user_doc["avatar_url"],
        bio=user_doc["bio"],
        created_at=user_doc["created_at"]
    )
    return Token(access_token=token, token_type="bearer", user=user_response)


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    db = get_database()
    users_col = db.get_collection("users")
    
    user_doc = await users_col.find_one({"email": credentials.email.lower()})
    if not user_doc or not verify_password(credentials.password, user_doc.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token({
        "sub": str(user_doc["_id"]),
        "email": user_doc["email"],
        "role": user_doc.get("role", "user")
    })
    
    user_response = UserResponse(
        id=str(user_doc["_id"]),
        email=user_doc["email"],
        full_name=user_doc.get("full_name", ""),
        role=user_doc.get("role", "user"),
        eco_points=user_doc.get("eco_points", 0),
        scans_count=user_doc.get("scans_count", 0),
        avatar_url=user_doc.get("avatar_url"),
        bio=user_doc.get("bio"),
        created_at=user_doc.get("created_at")
    )
    return Token(access_token=token, token_type="bearer", user=user_response)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user
