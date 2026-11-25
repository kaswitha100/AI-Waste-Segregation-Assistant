import io
import pytest
from PIL import Image
import numpy as np
from app.ml.classifier import classify_waste_image
from app.ml.taxonomy import map_prediction_to_waste, CATEGORIES
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token

def test_password_hashing():
    pwd = "SecurePassword123!"
    hashed = get_password_hash(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_flow():
    payload = {"sub": "user_123", "email": "test@waste.ai", "role": "user"}
    token = create_access_token(payload)
    assert isinstance(token, str)
    decoded = decode_access_token(token)
    assert decoded["sub"] == "user_123"
    assert decoded["email"] == "test@waste.ai"

def test_waste_taxonomy_mapping():
    # Recyclable test
    res = map_prediction_to_waste("water_bottle", 0.95)
    assert res["category"] == CATEGORIES["RECYCLABLE"]
    assert res["is_uncertain"] is False

    # Wet test
    res_wet = map_prediction_to_waste("banana", 0.92)
    assert res_wet["category"] == CATEGORIES["WET"]
    assert res_wet["is_uncertain"] is False

    # Hazardous test
    res_haz = map_prediction_to_waste("battery", 0.88)
    assert res_haz["category"] == CATEGORIES["HAZARDOUS"]

    # Uncertain test (low confidence)
    res_unc = map_prediction_to_waste("obscure_object", 0.12)
    assert res_unc["category"] == CATEGORIES["UNCERTAIN"]
    assert res_unc["is_uncertain"] is True

def test_synthetic_image_classification():
    # Create a synthetic 100x100 test image in memory
    img = Image.new("RGB", (100, 100), color=(73, 109, 137))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()

    result = classify_waste_image(img_bytes)
    assert result.item_name is not None
    assert result.category in [
        CATEGORIES["WET"],
        CATEGORIES["DRY"],
        CATEGORIES["RECYCLABLE"],
        CATEGORIES["HAZARDOUS"],
        CATEGORIES["UNCERTAIN"]
    ]
    assert 0.0 <= result.confidence <= 1.0
    assert result.disposal_guide is not None
    assert len(result.disposal_guide.steps) > 0
