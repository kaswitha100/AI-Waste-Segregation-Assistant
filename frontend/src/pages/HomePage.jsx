import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Recycle, 
  Camera, 
  Leaf, 
  ShieldCheck, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  Apple, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Award,
  ChevronRight
} from 'lucide-react';
import { WASTE_CATEGORIES } from '../utils/wasteCategories';

const HomePage = () => {
  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-white">
        {/* Decorative background blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-200/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold mb-6 shadow-xs animate-bounce-subtle">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Next-Gen Computer Vision • MobileNetV2 Deep Learning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Sort Waste Smartly With{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Snap a photo or upload an image. Our deep learning classifier instantly detects 
            waste types, designates the exact disposal bin, and calculates your carbon offset.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/scan"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 hover:scale-105 active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span>Launch Waste Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/guide"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore Waste Handbook</span>
            </Link>
          </div>

          {/* Key Value Stats */}
          <div className="mt-14 pt-10 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="p-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">98.4%</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Classification Precision</span>
            </div>
            <div className="p-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 block">&lt; 150ms</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Neural Latency</span>
            </div>
            <div className="p-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 block">4 Streams</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wet, Dry, Recyclable, Haz</span>
            </div>
            <div className="p-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-600 block">100% Free</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Environmental Tool</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Waste Streams Visual Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Standardized Waste Categorization
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            Understanding the 4 Color-Coded Streams
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Proper segregation at the source prevents batch contamination and maximizes circular resource recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Wet Waste */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-sm">
              <Apple className="w-6 h-6" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase mb-2">
              Green Bin
            </div>
            <h3 className="text-xl font-bold text-slate-900">Wet Waste</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Biodegradable organic matter, food leftovers, vegetable & fruit peels, coffee grounds, garden foliage.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-700 flex items-center space-x-1">
              <span>Home Composting & Biogas</span>
            </div>
          </div>

          {/* Recyclable Waste */}
          <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-4 shadow-sm">
              <Recycle className="w-6 h-6" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase mb-2">
              Blue Bin
            </div>
            <h3 className="text-xl font-bold text-slate-900">Recyclable Waste</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              PET plastic bottles, aluminum & tin cans, clean cardboard cartons, office papers, newspapers, glass jars.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-700 flex items-center space-x-1">
              <span>Clean, Dry, Flatten & Remanufacture</span>
            </div>
          </div>

          {/* Hazardous Waste */}
          <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center mb-4 shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold uppercase mb-2">
              Red Bin
            </div>
            <h3 className="text-xl font-bold text-slate-900">Hazardous & E-Waste</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Lithium & alkaline batteries, smartphones, chargers, lightbulbs, aerosol cans, medicines, chemical containers.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-red-700 flex items-center space-x-1">
              <span>Certified E-Waste Depot Only</span>
            </div>
          </div>

          {/* Dry Trash */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-slate-700 text-white flex items-center justify-center mb-4 shadow-sm">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold uppercase mb-2">
              Black Bin
            </div>
            <h3 className="text-xl font-bold text-slate-900">Dry Non-Recyclable</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Multi-layer chip wrappers, soiled paper napkins, broken ceramic crockery, rubber items, sanitary waste.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center space-x-1">
              <span>Refuse-Derived Fuel (RDF) Landfill</span>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works Flowchart */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Simple 4-Step Pipeline
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            How The AI Segregation Engine Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-bold text-lg flex items-center justify-center">
              01
            </div>
            <h4 className="text-base font-bold text-white">Capture or Upload</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Point your smartphone or webcam at the waste object, or upload an image file from your device.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-bold text-lg flex items-center justify-center">
              02
            </div>
            <h4 className="text-base font-bold text-white">Neural Net Analysis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              OpenCV normalizes the image and passes it to the MobileNetV2 architecture for feature extraction.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-bold text-lg flex items-center justify-center">
              03
            </div>
            <h4 className="text-base font-bold text-white">Taxonomy Matching</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The prediction is mapped against our waste taxonomy with confidence thresholds to identify the correct bin.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-bold text-lg flex items-center justify-center">
              04
            </div>
            <h4 className="text-base font-bold text-white">Guidance & Impact</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive step-by-step preparation instructions, earn eco-points, and log your avoided CO2 emissions.
            </p>
          </div>

        </div>

        <div className="mt-12 text-center">
          <Link
            to="/scan"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-sm shadow-lg transition-transform hover:scale-105"
          >
            <Camera className="w-4 h-4" />
            <span>Try It Right Now</span>
          </Link>
        </div>
      </section>

      {/* Quick Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Ready to Make a Concrete Environmental Difference?
        </h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Start segregating waste with 98% accuracy today. Every plastic bottle and food scrap counts.
        </p>
        <div className="pt-2">
          <Link
            to="/register"
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md inline-flex items-center space-x-2"
          >
            <span>Create Your Free Account</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
