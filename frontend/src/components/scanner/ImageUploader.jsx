import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

// Pre-packaged high quality sample images as SVG data URLs for instant zero-friction testing
const SAMPLE_ITEMS = [
  {
    name: 'Plastic Bottle',
    category: 'Recyclable',
    svgColor: '#2563EB',
    // Realistic SVG rendered as Data URL
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23f1f5f9'/><rect x='150' y='50' width='100' height='30' rx='5' fill='%232563eb'/><rect x='170' y='80' width='60' height='40' fill='%2393c5fd'/><rect x='140' y='120' width='120' height='230' rx='20' fill='%2360a5fa'/><rect x='140' y='190' width='120' height='80' fill='%232563eb'/><text x='200' y='235' font-family='sans-serif' font-size='14' font-weight='bold' fill='white' text-anchor='middle'>MINERAL WATER</text><text x='200' y='255' font-family='sans-serif' font-size='11' fill='white' text-anchor='middle'>100% RECYCLABLE PET</text></svg>"
  },
  {
    name: 'Banana Peels',
    category: 'Wet Waste',
    svgColor: '#10B981',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23f0fdf4'/><path d='M80,300 C120,320 280,340 330,180 C310,210 230,270 120,240 Z' fill='%23eab308'/><path d='M110,240 C170,250 260,230 300,140 C280,180 190,220 90,210 Z' fill='%23facc15'/><circle cx='130' cy='250' r='6' fill='%23713f12'/><circle cx='210' cy='260' r='5' fill='%23713f12'/><circle cx='280' cy='200' r='7' fill='%23713f12'/><text x='200' y='360' font-family='sans-serif' font-size='15' font-weight='bold' fill='%2315803d' text-anchor='middle'>ORGANIC FRUIT PEEL</text></svg>"
  },
  {
    name: 'AA Batteries',
    category: 'Hazardous',
    svgColor: '#DC2626',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23fef2f2'/><rect x='150' y='90' width='100' height='220' rx='10' fill='%23334155'/><rect x='180' y='70' width='40' height='20' rx='4' fill='%2394a3b8'/><rect x='150' y='210' width='100' height='100' rx='6' fill='%23f59e0b'/><text x='200' y='150' font-family='sans-serif' font-size='18' font-weight='bold' fill='white' text-anchor='middle'>1.5V AA</text><text x='200' y='180' font-family='sans-serif' font-size='12' fill='%2394a3b8' text-anchor='middle'>ALKALINE</text><text x='200' y='265' font-family='sans-serif' font-size='13' font-weight='bold' fill='%2378350f' text-anchor='middle'>BATTERY</text></svg>"
  },
  {
    name: 'Cardboard Box',
    category: 'Recyclable',
    svgColor: '#2563EB',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23f8fafc'/><polygon points='200,90 320,150 200,210 80,150' fill='%23d97706'/><polygon points='80,150 200,210 200,320 80,260' fill='%23b45309'/><polygon points='200,210 320,150 320,260 200,320' fill='%2392400e'/><text x='200' y='360' font-family='sans-serif' font-size='14' font-weight='bold' fill='%2378350f' text-anchor='middle'>CORRUGATED BOX</text></svg>"
  }
];

const ImageUploader = ({ onClassify, isClassifying }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (file) => {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (sample) => {
    setError(null);
    setPreviewUrl(sample.url);

    // Convert sample data URL to a File object
    const res = await fetch(sample.url);
    const blob = await res.blob();
    const file = new File([blob], `${sample.name.toLowerCase().replace(/ /g, '_')}.png`, { type: 'image/png' });
    setSelectedFile(file);
    setNotes(`Sample test item: ${sample.name}`);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError('Please upload or select an image first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    onClassify({ type: 'upload', data: formData, notes });
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Upload Container */}
      {!previewUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
              : 'border-slate-300 hover:border-emerald-400 bg-white/70 hover:bg-emerald-50/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files?.[0])}
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Upload Waste Item Image
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Drag and drop an image here, or click to browse from your device
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs font-medium text-slate-400">
            <span>JPG, PNG, WEBP</span>
            <span>•</span>
            <span>Up to 10MB</span>
          </div>
        </div>
      ) : (
        /* Image Preview & Submit Card */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="relative aspect-video max-h-80 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
            <img
              src={previewUrl}
              alt="Waste Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Optional Item Notes or Context
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Found near kitchen sink, rinsed beverage carton..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Choose Different Image
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isClassifying}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/30 flex items-center space-x-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
              >
                {isClassifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Neural Network...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Classify Waste Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error alert if any */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Test Sample Items Bar */}
      <div className="pt-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Or Test Instantly With Pre-Loaded Samples</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_ITEMS.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => handleSelectSample(sample)}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group flex items-center space-x-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50">
                <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-emerald-700">
                  {sample.name}
                </p>
                <span className="text-[10px] font-medium text-slate-400 block truncate">
                  {sample.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
