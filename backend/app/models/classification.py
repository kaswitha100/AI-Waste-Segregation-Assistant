from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class DisposalGuide(BaseModel):
    bin_name: str
    bin_color: str
    primary_action: str
    steps: List[str]
    dos: List[str]
    donts: List[str]
    environmental_impact: str
    decomposition_time: str

class PredictionItem(BaseModel):
    label: str
    confidence: float
    category: str

class ClassificationResponse(BaseModel):
    id: Optional[str] = None
    _id: Optional[str] = None
    item_name: str
    category: str
    confidence: float
    is_uncertain: bool
    top_predictions: List[PredictionItem] = []
    disposal_guide: DisposalGuide
    eco_points_earned: int = 10
    co2_saved_kg: float = 0.25
    scanned_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HistoryRecordCreate(BaseModel):
    user_id: Optional[str] = None
    item_name: str
    category: str
    confidence: float
    is_uncertain: bool
    disposal_guide: DisposalGuide
    image_preview: Optional[str] = None
    notes: Optional[str] = None

class HistoryRecordResponse(BaseModel):
    id: str
    _id: Optional[str] = None
    user_id: Optional[str] = None
    item_name: str
    category: str
    confidence: float
    is_uncertain: bool = False
    disposal_guide: DisposalGuide
    image_preview: Optional[str] = None
    notes: Optional[str] = None
    feedback: Optional[str] = None  # "helpful", "incorrect", etc.
    timestamp: datetime

    model_config = {
        "populate_by_name": True
    }

class FeedbackRequest(BaseModel):
    feedback: str  # "accurate", "inaccurate", "helpful"
    user_correction: Optional[str] = None

class UserNoteRequest(BaseModel):
    notes: str

class AnalyticsStats(BaseModel):
    total_scans: int
    category_counts: Dict[str, int]
    total_eco_points: int
    total_co2_saved_kg: float
    weekly_activity: List[Dict[str, Any]]
    accuracy_rate: float
