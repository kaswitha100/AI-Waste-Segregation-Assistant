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

@pytest.mark.anyio
async def test_database_operations():
    from app.db.database import ResilientAsyncCollection
    import tempfile
    import shutil

    temp_dir = tempfile.mkdtemp()
    try:
        col = ResilientAsyncCollection("test_col", data_dir=temp_dir)
        
        # Test Insert
        res1 = await col.insert_one({"_id": "item1", "name": "Plastic Bottle", "category": "Recyclable Waste", "count": 1})
        res2 = await col.insert_one({"_id": "item2", "name": "Banana Peel", "category": "Wet Waste", "count": 2})
        assert res1.inserted_id == "item1"
        assert res2.inserted_id == "item2"

        # Test Count
        count_all = await col.count_documents({})
        assert count_all == 2

        # Test Find One
        doc = await col.find_one({"name": "Plastic Bottle"})
        assert doc is not None
        assert doc["_id"] == "item1"

        # Test Update $set and $inc
        await col.update_one({"_id": "item1"}, {"$set": {"verified": True}, "$inc": {"count": 5}})
        updated = await col.find_one({"_id": "item1"})
        assert updated["verified"] is True
        assert updated["count"] == 6

        # Test Find with $regex
        regex_items = await col.find({"name": {"$regex": "bottle"}}).to_list()
        assert len(regex_items) == 1
        assert regex_items[0]["_id"] == "item1"

        # Test Find with $or
        or_items = await col.find({"$or": [{"category": "Wet Waste"}, {"category": "Nonexistent"}]}).to_list()
        assert len(or_items) == 1
        assert or_items[0]["_id"] == "item2"

        # Test Delete
        del_res = await col.delete_one({"_id": "item1"})
        assert del_res.deleted_count == 1
        assert await col.count_documents({}) == 1

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

def test_disposal_guide_generation():
    from app.ml.disposal_guide import get_disposal_guide_for_category
    
    for cat in ["Wet Waste", "Recyclable Waste", "Hazardous Waste", "Dry Waste", "Uncertain / Mixed Waste"]:
        guide = get_disposal_guide_for_category(cat)
        assert guide.bin_name != ""
        assert guide.bin_color != ""
        assert len(guide.steps) >= 3
        assert len(guide.dos) >= 2
        assert len(guide.donts) >= 2
        assert guide.environmental_impact != ""
        assert guide.decomposition_time != ""

