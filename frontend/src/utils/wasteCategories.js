export const WASTE_CATEGORIES = {
  WET: {
    id: 'Wet Waste',
    name: 'Wet Waste',
    label: 'Organic / Biodegradable',
    binName: 'Green Compost Bin',
    binColor: '#10B981',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderClass: 'border-emerald-500',
    lightBg: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    icon: 'Apple',
    examples: ['Fruit & vegetable peels', 'Leftover cooked food', 'Egg shells', 'Coffee grounds', 'Garden leaves'],
    disposalAction: 'Compost at home or dispose in municipal green organic bin.'
  },
  RECYCLABLE: {
    id: 'Recyclable Waste',
    name: 'Recyclable Waste',
    label: 'Plastics, Cardboard, Paper, Metal, Glass',
    binName: 'Blue Recycling Bin',
    binColor: '#2563EB',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    borderClass: 'border-blue-500',
    lightBg: 'bg-blue-50',
    textClass: 'text-blue-700',
    icon: 'Recycle',
    examples: ['Plastic PET bottles', 'Soda & tin cans', 'Clean cardboard boxes', 'Newspapers & paper', 'Glass jars'],
    disposalAction: 'Empty, rinse clean, air dry, flatten, and deposit in the blue recycling bin.'
  },
  HAZARDOUS: {
    id: 'Hazardous Waste',
    name: 'Hazardous Waste',
    label: 'E-Waste, Batteries, Chemicals, Medical',
    binName: 'Red Hazardous Bin',
    binColor: '#DC2626',
    badgeClass: 'bg-red-100 text-red-800 border-red-300',
    borderClass: 'border-red-500',
    lightBg: 'bg-red-50',
    textClass: 'text-red-700',
    icon: 'AlertTriangle',
    examples: ['Household AA/AAA batteries', 'Smartphone / E-waste', 'Fluorescent CFL bulbs', 'Paint & chemical cans', 'Expired medicines'],
    disposalAction: 'Tape terminal ends, keep sealed in non-metal container, drop at certified e-waste or toxic depot.'
  },
  DRY: {
    id: 'Dry Waste',
    name: 'Dry Waste',
    label: 'Non-Recyclable Domestic Trash',
    binName: 'Black / Dark Grey Trash Bin',
    binColor: '#4B5563',
    badgeClass: 'bg-slate-200 text-slate-800 border-slate-300',
    borderClass: 'border-slate-500',
    lightBg: 'bg-slate-50',
    textClass: 'text-slate-700',
    icon: 'Trash2',
    examples: ['Multi-layer chip wrappers', 'Soiled napkins & wipes', 'Broken ceramic mugs', 'Old rubber & textiles', 'Sanitary waste'],
    disposalAction: 'Wrap sharp pieces safely, tie securely in a bag, dispose into the general dry waste bin.'
  },
  UNCERTAIN: {
    id: 'Uncertain / Mixed Waste',
    name: 'Uncertain / Mixed Waste',
    label: 'Mixed / Requires Manual Inspection',
    binName: 'Yellow Multi-Sort Bin',
    binColor: '#D97706',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    borderClass: 'border-amber-500',
    lightBg: 'bg-amber-50',
    textClass: 'text-amber-700',
    icon: 'HelpCircle',
    examples: ['Composite items', 'Obscure items with low confidence', 'Multi-material products'],
    disposalAction: 'Separate separable layers (paper from plastic), check resin code, or inspect manually.'
  }
};

export const getCategoryMeta = (categoryName) => {
  if (!categoryName) return WASTE_CATEGORIES.UNCERTAIN;
  const match = Object.values(WASTE_CATEGORIES).find(
    c => c.name.toLowerCase() === categoryName.toLowerCase() || c.id.toLowerCase() === categoryName.toLowerCase()
  );
  return match || WASTE_CATEGORIES.UNCERTAIN;
};
