import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Check, 
  X, 
  Leaf, 
  Recycle, 
  AlertTriangle, 
  Trash2, 
  Clock, 
  Info,
  ChevronDown
} from 'lucide-react';
import { WASTE_CATEGORIES } from '../utils/wasteCategories';

const ITEM_DICTIONARY = [
  { name: 'Plastic Beverage Bottle (PET)', category: 'Recyclable Waste', bin: 'Blue', tip: 'Rinse with water, dry, compress bottle, replace cap.' },
  { name: 'Banana Peels & Fruit Skins', category: 'Wet Waste', bin: 'Green', tip: 'Drain excess juice. Perfect for home composting or biogas.' },
  { name: 'AA / AAA Alkaline Battery', category: 'Hazardous Waste', bin: 'Red', tip: 'Tape terminals with clear tape. Never throw in regular trash.' },
  { name: 'Cardboard Delivery Box', category: 'Recyclable Waste', bin: 'Blue', tip: 'Remove shipping tape, flatten flat to save bin space.' },
  { name: 'Potato Chip Silver Wrapper', category: 'Dry Waste', bin: 'Black', tip: 'Multi-layer plastic cannot be recycled normally. Keep dry.' },
  { name: 'Fluorescent CFL / Tube Light', category: 'Hazardous Waste', bin: 'Red', tip: 'Contains toxic mercury vapor. Seal in plastic if broken.' },
  { name: 'Leftover Cooked Food', category: 'Wet Waste', bin: 'Green', tip: 'Drain broth/gravy. Mix with dry leaves if composting.' },
  { name: 'Soda & Beverage Aluminum Can', category: 'Recyclable Waste', bin: 'Blue', tip: 'Rinse residue. Aluminum can be recycled infinitely with zero degradation.' },
  { name: 'Smartphone / Charger Cable', category: 'Hazardous Waste', bin: 'Red', tip: 'Valuable precious metals inside. Take to certified e-waste bin.' },
  { name: 'Greasy Used Pizza Box', category: 'Dry Waste', bin: 'Black', tip: 'Grease contaminates paper recycling pulpers. Put soiled half in trash.' },
  { name: 'Broken Ceramic Coffee Mug', category: 'Dry Waste', bin: 'Black', tip: 'Wrap broken sharp edges in paper before binning for sanitation safety.' },
  { name: 'Egg Shells & Coffee Grounds', category: 'Wet Waste', bin: 'Green', tip: 'Rich in calcium and nitrogen; excellent direct garden fertilizer.' }
];

const GuidePage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredItems = ITEM_DICTIONARY.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Waste Segregation Standard</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Comprehensive Waste Segregation Handbook
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything you need to know about color-coded waste streams, municipal guidelines, and proper disposal.
        </p>
      </div>

      {/* 4 Bins Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Green Bin: Wet Waste */}
        <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Green Bin
            </span>
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Wet Waste (Biodegradable)</h3>
            <p className="text-xs text-slate-500 mt-1">
              All organic kitchen, culinary, and garden waste that decomposes naturally.
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-700">What Goes Here:</p>
            <p className="text-slate-600 leading-relaxed">
              Fruit peels, vegetable trimmings, leftover cooked foods, egg shells, coffee grounds, tea bags, garden leaves, flowers.
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 space-y-1">
            <span className="font-bold block">Key Tip:</span>
            <span>Drain excess watery gravy before throwing. Never put plastic bags or cling wrap in the green bin.</span>
          </div>
        </div>

        {/* Blue Bin: Recyclable Waste */}
        <div className="bg-white rounded-3xl border-2 border-blue-500/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
              Blue Bin
            </span>
            <Recycle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Recyclable Waste</h3>
            <p className="text-xs text-slate-500 mt-1">
              Dry, clean materials that can be mechanically melted, remanufactured, or re-pulped.
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-700">What Goes Here:</p>
            <p className="text-slate-600 leading-relaxed">
              Plastic bottles (PET #1, HDPE #2), aluminum cans, tin food cans, clean cardboard, newspapers, glass bottles, envelopes.
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900 space-y-1">
            <span className="font-bold block">Key Tip:</span>
            <span>Always rinse out residual fluids and air dry before recycling. Contaminated paper cannot be recycled.</span>
          </div>
        </div>

        {/* Red Bin: Hazardous Waste */}
        <div className="bg-white rounded-3xl border-2 border-red-500/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
              Red Bin
            </span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Hazardous & E-Waste</h3>
            <p className="text-xs text-slate-500 mt-1">
              Toxic, corrosive, flammable, or heavy-metal containing items that leach into soil.
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-700">What Goes Here:</p>
            <p className="text-slate-600 leading-relaxed">
              Batteries, smartphones, chargers, laptops, fluorescent tube lights, aerosol spray cans, paints, syringes, expired medicines.
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-xs text-red-900 space-y-1">
            <span className="font-bold block">Key Tip:</span>
            <span>Keep battery ends taped. Hand over strictly to authorized hazardous drop-off kiosks or electronic collection drives.</span>
          </div>
        </div>

        {/* Black Bin: Non-Recyclable Dry Trash */}
        <div className="bg-white rounded-3xl border-2 border-slate-600/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider">
              Black Bin
            </span>
            <Trash2 className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Dry Non-Recyclable Waste</h3>
            <p className="text-xs text-slate-500 mt-1">
              Residual household domestic trash that cannot be recycled or composted safely.
            </p>
          </div>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-700">What Goes Here:</p>
            <p className="text-slate-600 leading-relaxed">
              Multi-layered chip bags, soiled napkins, sanitary pads/diapers, broken ceramics, rubber footwear, vacuum dust, cigarette butts.
            </p>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-800 space-y-1">
            <span className="font-bold block">Key Tip:</span>
            <span>Bag securely and tie tightly to protect sanitation workers. Converted to refuse fuel (RDF) or engineered landfill.</span>
          </div>
        </div>

      </div>

      {/* Searchable Waste Dictionary */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Instant Waste Item Search
            </h3>
            <p className="text-xs text-slate-500">
              Look up any common household waste object for its exact bin assignment
            </p>
          </div>

          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. Battery, Banana, Pizza box..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Dictionary Table */}
        <div className="divide-y divide-slate-100 overflow-x-auto">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                <p className="text-slate-500">{item.tip}</p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                  item.bin === 'Green' ? 'bg-emerald-100 text-emerald-800' :
                  item.bin === 'Blue' ? 'bg-blue-100 text-blue-800' :
                  item.bin === 'Red' ? 'bg-red-100 text-red-800' :
                  'bg-slate-200 text-slate-800'
                }`}>
                  {item.bin} Bin
                </span>
                <span className="text-slate-400 font-medium">({item.category})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default GuidePage;
