import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Heart, Shield, Globe, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EcoSegregate AI</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Transforming municipal and household waste segregation through real-time Computer Vision deep learning.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Classifier Live • 98.4% Accuracy</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Segregation Stream</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/guide" className="hover:text-emerald-400 transition-colors">Wet Waste (Green Bin)</Link></li>
              <li><Link to="/guide" className="hover:text-emerald-400 transition-colors">Recyclables (Blue Bin)</Link></li>
              <li><Link to="/guide" className="hover:text-emerald-400 transition-colors">Hazardous & E-Waste (Red)</Link></li>
              <li><Link to="/guide" className="hover:text-emerald-400 transition-colors">Non-Recyclable Dry Trash</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">AI Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/scan" className="hover:text-emerald-400 transition-colors">Live Camera Scanner</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Eco Points & Impact</Link></li>
              <li><Link to="/history" className="hover:text-emerald-400 transition-colors">Classification History</Link></li>
              <li><Link to="/analytics" className="hover:text-emerald-400 transition-colors">Carbon & Diversion Stats</Link></li>
            </ul>
          </div>

          {/* Environmental Mission */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Environmental Mission</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every item correctly sorted prevents methane emission from landfills and saves valuable raw materials.
            </p>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <p className="text-emerald-400 font-semibold mb-1 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-Waste Pledge</span>
              </p>
              <p className="text-slate-400">Rinse, Segregate, and Dispose Responsibly.</p>
            </div>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AI Waste Segregation Assistant. Built for a sustainable circular economy.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Powered by MobileNetV2 Deep Neural Network</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
