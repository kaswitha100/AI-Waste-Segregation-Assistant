"""
Comprehensive Waste Taxonomy mapping real-world objects and ImageNet classes
to the 4 waste segregation categories:
1. Wet Waste (Organic / Biodegradable)
2. Dry Waste (Non-biodegradable / Non-recyclable dry domestic waste)
3. Recyclable Waste (Plastics, Cardboard, Paper, Glass, Metals)
4. Hazardous Waste (E-waste, Batteries, Chemicals, Sharp/Medical items)
"""

CATEGORIES = {
    "WET": "Wet Waste",
    "DRY": "Dry Waste",
    "RECYCLABLE": "Recyclable Waste",
    "HAZARDOUS": "Hazardous Waste",
    "UNCERTAIN": "Uncertain / Mixed Waste"
}

# Mapping keywords / Synsets to Categories and normalized Item Names
TAXONOMY_MAPPINGS = [
    # --- RECYCLABLE WASTE ---
    {
        "keywords": ["water_bottle", "plastic_bottle", "pop_bottle", "pill_bottle", "polyethylene", "pet_bottle"],
        "category": CATEGORIES["RECYCLABLE"],
        "item_name": "Plastic Bottle",
        "eco_points": 15,
        "co2_saved_kg": 0.45
    },
    {
        "keywords": ["beer_bottle", "wine_bottle", "whiskey_jug", "glass", "beaker", "jar", "glass_bottle", "carafe"],
        "category": CATEGORIES["RECYCLABLE"],
        "item_name": "Glass Bottle / Jar",
        "eco_points": 20,
        "co2_saved_kg": 0.60
    },
    {
        "keywords": ["beer_can", "tin_can", "can", "soda_can", "coke_can", "aluminum", "can_opener", "steel_can"],
        "category": CATEGORIES["RECYCLABLE"],
        "item_name": "Metal Can (Aluminum / Tin)",
        "eco_points": 25,
        "co2_saved_kg": 0.85
    },
    {
        "keywords": ["carton", "cardboard", "box", "shipping_box", "corrugated", "package", "crate"],
        "category": CATEGORIES["RECYCLABLE"],
        "item_name": "Cardboard Box / Packaging",
        "eco_points": 15,
        "co2_saved_kg": 0.50
    },
    {
        "keywords": ["newspaper", "book", "comic_book", "magazine", "paper", "envelope", "notebook", "menu", "paper_towel"],
        "category": CATEGORIES["RECYCLABLE"],
        "item_name": "Paper / Newspaper",
        "eco_points": 10,
        "co2_saved_kg": 0.30
    },
    {
        "keywords": ["cup", "coffee_cup", "paper_cup", "plastic_cup", "mug"],
        "category": CATEGORIES["RECYCLABLE"],
        "item_name": "Paper / Plastic Cup",
        "eco_points": 10,
        "co2_saved_kg": 0.20
    },
    {
        "keywords": ["bucket", "plastic_bag", "crate", "plastic_tray", "tub"],
        "category": CATEGORIES["RECYCLABLE"],
        "item_name": "Rigid Plastic Container",
        "eco_points": 15,
        "co2_saved_kg": 0.40
    },

    # --- WET WASTE (BIODEGRADABLE / ORGANIC) ---
    {
        "keywords": ["banana", "banana_peel", "peel", "fruit_skin"],
        "category": CATEGORIES["WET"],
        "item_name": "Fruit Peels (Banana / Citrus)",
        "eco_points": 15,
        "co2_saved_kg": 0.35
    },
    {
        "keywords": ["apple", "orange", "lemon", "pineapple", "strawberry", "fig", "pomegranate", "grape", "peach", "custard_apple", "jackfruit"],
        "category": CATEGORIES["WET"],
        "item_name": "Fruit Scraps / Food Waste",
        "eco_points": 15,
        "co2_saved_kg": 0.35
    },
    {
        "keywords": ["bell_pepper", "cucumber", "zucchini", "broccoli", "cauliflower", "cabbage", "head_cabbage", "artichoke", "cardoon", "mushroom", "onion", "potato", "vegetable"],
        "category": CATEGORIES["WET"],
        "item_name": "Vegetable Peels / Kitchen Scraps",
        "eco_points": 15,
        "co2_saved_kg": 0.40
    },
    {
        "keywords": ["pizza", "burrito", "cheeseburger", "hamburger", "hotdog", "sandwich", "bagel", "pretzel", "french_loaf", "bakery", "bread", "pastry", "dough", "leftovers", "food"],
        "category": CATEGORIES["WET"],
        "item_name": "Leftover Cooked Food",
        "eco_points": 10,
        "co2_saved_kg": 0.30
    },
    {
        "keywords": ["egg", "eggshell", "potpie", "meat_loaf", "soup_bowl", "plate_waste", "coffee_grounds", "tea_bag"],
        "category": CATEGORIES["WET"],
        "item_name": "Organic Food Scraps & Eggshells",
        "eco_points": 12,
        "co2_saved_kg": 0.30
    },

    # --- HAZARDOUS WASTE ---
    {
        "keywords": ["battery", "accumulator", "cell", "dry_cell", "car_battery", "lithium"],
        "category": CATEGORIES["HAZARDOUS"],
        "item_name": "Batteries (Household / Lithium)",
        "eco_points": 30,
        "co2_saved_kg": 1.20
    },
    {
        "keywords": ["cellular_telephone", "cellphone", "mobile_phone", "smartphone", "iphone", "telephone"],
        "category": CATEGORIES["HAZARDOUS"],
        "item_name": "Electronic Waste (Mobile / Phone)",
        "eco_points": 35,
        "co2_saved_kg": 2.50
    },
    {
        "keywords": ["laptop", "notebook_computer", "computer_keyboard", "mouse", "monitor", "hard_disc", "modem", "screen", "circuit_board", "electronic", "remote_control", "charger", "cable"],
        "category": CATEGORIES["HAZARDOUS"],
        "item_name": "E-Waste (Computer / Electronics)",
        "eco_points": 35,
        "co2_saved_kg": 2.80
    },
    {
        "keywords": ["lightbulb", "light_bulb", "fluorescent_tube", "lamp", "spotlight", "torch"],
        "category": CATEGORIES["HAZARDOUS"],
        "item_name": "Fluorescent Bulb / CFL / Tube Light",
        "eco_points": 25,
        "co2_saved_kg": 1.00
    },
    {
        "keywords": ["aerosol", "spray_can", "insecticide", "paint_can", "solvent", "chemical", "perfume", "lotion"],
        "category": CATEGORIES["HAZARDOUS"],
        "item_name": "Aerosol Spray / Chemical Container",
        "eco_points": 25,
        "co2_saved_kg": 1.10
    },
    {
        "keywords": ["syringe", "thermometer", "medicine", "pill", "blister_pack", "vial", "bandage"],
        "category": CATEGORIES["HAZARDOUS"],
        "item_name": "Medical / Sharp Waste",
        "eco_points": 30,
        "co2_saved_kg": 0.90
    },

    # --- DRY WASTE (NON-RECYCLABLE DRY RESIDUAL) ---
    {
        "keywords": ["wrapper", "chip_bag", "snack_wrapper", "candy_wrapper", "foil_packet", "sachet", "straw"],
        "category": CATEGORIES["DRY"],
        "item_name": "Multi-Layered Plastic Wrapper",
        "eco_points": 10,
        "co2_saved_kg": 0.15
    },
    {
        "keywords": ["sponge", "loofah", "mop", "broom", "dustpan", "cloth", "rag", "tissue", "soiled_napkin", "wipe"],
        "category": CATEGORIES["DRY"],
        "item_name": "Soiled Dry Waste / Tissues",
        "eco_points": 10,
        "co2_saved_kg": 0.10
    },
    {
        "keywords": ["shoe", "sandal", "leather", "rubber_eraser", "boot", "sock", "textile_scrap"],
        "category": CATEGORIES["DRY"],
        "item_name": "Textile & Rubber Dry Waste",
        "eco_points": 10,
        "co2_saved_kg": 0.20
    },
    {
        "keywords": ["ceramic", "porcelain", "flowerpot", "broken_plate", "clay"],
        "category": CATEGORIES["DRY"],
        "item_name": "Broken Ceramics / Pottery",
        "eco_points": 10,
        "co2_saved_kg": 0.15
    }
]

# Non-waste classes (people, scenery, animals, furniture) to prevent false classification
NON_WASTE_KEYWORDS = [
    "person", "human", "face", "dog", "cat", "horse", "bird", "mountain",
    "seashore", "sky", "cloud", "tree", "forest", "car", "sports_car",
    "airplane", "building", "church", "bridge"
]

def map_prediction_to_waste(predicted_label: str, confidence: float):
    """
    Evaluates model prediction label against the waste taxonomy.
    Returns matched category, clean item name, eco-points, co2 saved, and uncertainty status.
    """
    label_lower = predicted_label.lower().replace(" ", "_")

    # Check if object is clearly non-waste or if confidence is too low
    for non_waste in NON_WASTE_KEYWORDS:
        if non_waste in label_lower and confidence > 0.40:
            return {
                "category": CATEGORIES["UNCERTAIN"],
                "item_name": f"Non-Waste Object ({predicted_label.title()})",
                "is_uncertain": True,
                "eco_points": 0,
                "co2_saved_kg": 0.0,
                "match_score": 0.1
            }

    if confidence < 0.20:
        return {
            "category": CATEGORIES["UNCERTAIN"],
            "item_name": "Unrecognized Waste Item",
            "is_uncertain": True,
            "eco_points": 5,
            "co2_saved_kg": 0.05,
            "match_score": confidence
        }

    # Best-match search in taxonomy
    for entry in TAXONOMY_MAPPINGS:
        for kw in entry["keywords"]:
            if kw in label_lower or label_lower in kw:
                return {
                    "category": entry["category"],
                    "item_name": entry["item_name"],
                    "is_uncertain": False,
                    "eco_points": entry["eco_points"],
                    "co2_saved_kg": entry["co2_saved_kg"],
                    "match_score": confidence
                }

    # General heuristic fallbacks based on common words
    if any(w in label_lower for w in ["bottle", "can", "paper", "cardboard", "box", "glass"]):
        return {
            "category": CATEGORIES["RECYCLABLE"],
            "item_name": predicted_label.replace("_", " ").title(),
            "is_uncertain": False,
            "eco_points": 15,
            "co2_saved_kg": 0.4,
            "match_score": confidence
        }
    elif any(w in label_lower for w in ["fruit", "vegetable", "food", "meat", "bread", "meal"]):
        return {
            "category": CATEGORIES["WET"],
            "item_name": predicted_label.replace("_", " ").title(),
            "is_uncertain": False,
            "eco_points": 15,
            "co2_saved_kg": 0.35,
            "match_score": confidence
        }
    elif any(w in label_lower for w in ["battery", "device", "phone", "electronics", "bulb"]):
        return {
            "category": CATEGORIES["HAZARDOUS"],
            "item_name": predicted_label.replace("_", " ").title(),
            "is_uncertain": False,
            "eco_points": 30,
            "co2_saved_kg": 1.5,
            "match_score": confidence
        }

    # If confidence is moderate (0.20 - 0.35) and not matching known waste patterns
    return {
        "category": CATEGORIES["UNCERTAIN"],
        "item_name": f"Uncertain ({predicted_label.replace('_', ' ').title()})",
        "is_uncertain": True,
        "eco_points": 5,
        "co2_saved_kg": 0.05,
        "match_score": confidence
    }
