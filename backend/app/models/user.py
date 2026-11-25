from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field

EMAIL_PATTERN = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

class UserBase(BaseModel):
    email: str = Field(..., pattern=EMAIL_PATTERN)
    full_name: str
    role: str = "user"  # "user" or "admin"

class UserCreate(BaseModel):
    email: str = Field(..., pattern=EMAIL_PATTERN)
    full_name: str
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: str = Field(..., pattern=EMAIL_PATTERN)
    password: str

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str
    eco_points: int = 0
    scans_count: int = 0
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True
    }

class UserResponse(UserBase):
    id: str
    eco_points: int = 0
    scans_count: int = 0
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime

    model_config = {
        "populate_by_name": True
    }

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
