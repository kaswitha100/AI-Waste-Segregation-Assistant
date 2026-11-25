"""
Disposal Guidance Generator providing precise environmental instructions,
bin colors, practical steps, do's & don'ts, and decomposition timeframes.
"""

from typing import Dict
from app.models.classification import DisposalGuide

GUIDELINES: Dict[str, dict] = {
    "Wet Waste": {
        "bin_name": "Organic / Compost Bin",
        "bin_color": "Green",
        "primary_action": "Home Composting or Municipal Organic Digestion",
        "steps": [
            "Drain any excess soup, curry, or liquid before disposing.",
            "Remove all plastic wrappers, stickers, or rubber bands.",
            "Place into a green biodegradable bag or directly in the green organic bin.",
            "Cover the bin tightly to prevent fruit flies and unwanted odors."
        ],
        "dos": [
            "Do include fruit peels, vegetable scraps, leftover food, and eggshells.",
            "Do use newspaper lining or certified compostable bags.",
            "Do mix brown dry leaves if composting at home to balance nitrogen."
        ],
        "donts": [
            "Don't mix plastic containers, foil, cutlery, or toothpicks.",
            "Don't put pet feces or sanitary waste in the organic bin.",
            "Don't pour large quantities of cooking oil directly into the bin."
        ],
        "environmental_impact": "Diverts methane-generating organics from landfills and enriches soil with nutrient-dense humus.",
        "decomposition_time": "2 weeks to 6 months depending on temperature and aeration"
    },
    "Recyclable Waste": {
        "bin_name": "Recycling Collection Bin",
        "bin_color": "Blue",
        "primary_action": "Clean, Dry, Flatten & Recycle",
        "steps": [
            "Rinse out food, sugary beverage, or dairy residue with a little water.",
            "Air dry the item to prevent mold and contamination of paper/cardboard.",
            "Flatten plastic bottles, aluminum cans, and cardboard boxes to save bin space.",
            "Deposit in the dry blue recycling bin or drop off at a local recycling facility."
        ],
        "dos": [
            "Do keep plastics, clean cardboard, newspapers, and tin cans dry.",
            "Do keep bottle caps attached to bottles if accepted locally.",
            "Do bundle clean paper sheets together."
        ],
        "donts": [
            "Don't put greasy pizza boxes or oil-stained cardboard in recycling.",
            "Don't include plastic bags or shrink wrap unless accepted separately.",
            "Don't mix broken window glass or mirrors with bottle glass."
        ],
        "environmental_impact": "Reduces virgin resource extraction, saves up to 95% energy compared to making new aluminum/plastic, and cuts carbon footprint.",
        "decomposition_time": "Cardboard: 2 months | Aluminum: 200-500 years | Plastic Bottle: 450 years | Glass: 1 million+ years"
    },
    "Hazardous Waste": {
        "bin_name": "Hazardous & E-Waste Bin",
        "bin_color": "Red",
        "primary_action": "Isolate & Hand Over to Authorized E-Waste / Hazardous Center",
        "steps": [
            "Never throw in general trash bins or incinerate.",
            "Tape the terminals of lithium or button batteries with clear electrical tape.",
            "Store in a sturdy, non-metallic, dry container away from sunlight and children.",
            "Drop off at designated electronic recycling kiosks, battery bins, or toxic drop-off events."
        ],
        "dos": [
            "Do keep broken CFL bulbs inside a sealed plastic container to capture mercury vapor.",
            "Do handle corroded batteries with rubber gloves.",
            "Do wipe device memory before sending electronics for recycling."
        ],
        "donts": [
            "Don't crush, puncture, or submerge batteries in water.",
            "Don't pour paint, bleach, or solvents down the household drain.",
            "Don't mix hazardous materials together in a single open bag."
        ],
        "environmental_impact": "Prevents toxic heavy metals (lead, cadmium, mercury, lithium) from leaching into groundwater and agricultural soil.",
        "decomposition_time": "Non-biodegradable; toxins remain permanently hazardous without high-temperature treatment"
    },
    "Dry Waste": {
        "bin_name": "Non-Recyclable Dry Trash Bin",
        "bin_color": "Black",
        "primary_action": "Secure Bagging for Waste-to-Energy or Controlled Landfill",
        "steps": [
            "Ensure the item is free of rotting food or wet organic fluids.",
            "Wrap sharp broken ceramic fragments in newspaper for sanitation worker safety.",
            "Place into a sturdy trash bag and tie securely.",
            "Deposit in the non-recyclable municipal dry waste bin."
        ],
        "dos": [
            "Do wrap broken pottery, multi-layer snack wrappers, and old sponges.",
            "Do keep the dry trash separate from wet composting streams.",
            "Do minimize using single-use non-recyclable multi-layered packaging."
        ],
        "donts": [
            "Don't dump wet organic food or slurry into the dry bin.",
            "Don't place batteries, electronics, or medical waste here.",
            "Don't burn dry domestic waste openly."
        ],
        "environmental_impact": "Managed under municipal RDF (Refuse-Derived Fuel) or engineered sanitary landfills.",
        "decomposition_time": "Multi-layer plastic & ceramics: 50 to 500+ years"
    },
    "Uncertain / Mixed Waste": {
        "bin_name": "Manual Inspection / Multi-Sort Area",
        "bin_color": "Yellow",
        "primary_action": "Inspect Material Composition Before Disposal",
        "steps": [
            "Check the recycling resin code on the bottom of the item (numbers 1 through 7).",
            "Separate composite materials (e.g., detach paper label from plastic cup).",
            "If mostly organic food material, discard into Green Bin.",
            "If clean recyclable rigid plastic/metal/paper, discard into Blue Bin.",
            "If containing circuit boards, wires, or batteries, treat as Red Bin Hazardous."
        ],
        "dos": [
            "Do perform a visual test: is it organic, clean paper, metal, or electronic?",
            "Do ask your local municipality when in doubt."
        ],
        "donts": [
            "Don't guess randomly and throw non-recyclables into the blue bin (wishcycling).",
            "Don't dispose hazardous materials in ordinary trash."
        ],
        "environmental_impact": "Careful sorting prevents batch contamination at municipal recycling facilities.",
        "decomposition_time": "Varies by material composition"
    }
}

def get_disposal_guide_for_category(category: str) -> DisposalGuide:
    info = GUIDELINES.get(category, GUIDELINES["Uncertain / Mixed Waste"])
    return DisposalGuide(
        bin_name=info["bin_name"],
        bin_color=info["bin_color"],
        primary_action=info["primary_action"],
        steps=info["steps"],
        dos=info["dos"],
        donts=info["donts"],
        environmental_impact=info["environmental_impact"],
        decomposition_time=info["decomposition_time"]
    )
