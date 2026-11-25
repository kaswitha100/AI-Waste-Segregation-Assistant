import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  Leaf, 
  Trash2, 
  Check, 
  X, 
  Info, 
  Award,
  ArrowRight,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { getCategoryMeta } from '../../utils/wasteCategories';
import { historyAPI } from '../../services/api';

const ClassificationResult = ({ result, onScanAgain, onFeedbackSubmitted }) => {
  if (!result) return null;

  const [feedback, setFeedback] = useState(null);
  const categoryMeta = getCategoryMeta(result.category);
  const confidencePercent = Math.round((result.confidence || 0) * 100);

  const handleFeedback = async (type) => {
    setFeedback(type);
    const recId = result.id || result._id;
    if (recId) {
      try {
        await historyAPI.submitFeedback(recId, type);
      } catch (err) {
        console.error('Feedback error:', err);
      }
    }
  };

  // Trigger eco confetti when a high-confidence recyclable or wet waste item is classified
  useEffect(() => {
    if (!result.is_uncertain && confidencePercent >= 70) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#3B82F6', '#F59E0B']
        });
      } catch (e) {
        // Safe fallback if confetti isn't supported
      }
    }
  }, [result]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden transition-all animate-fadeIn">
      
      {/* Top Banner with Bin Categorization */}
      <div 
        className="px-6 py-5 text-white flex flex-wrap items-center justify-between gap-4"
        style={{ backgroundColor: categoryMeta.binColor }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
            {result.is_uncertain ? (
              <HelpCircle className="w-6 h-6 text-white" />
            ) : result.category === 'Hazardous Waste' ? (
              <AlertTriangle className="w-6 h-6 text-white" />
            ) : (
              <Leaf className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Segregation Category
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              {result.category}
            </h2>
          </div>
        </div>

        {/* Eco points & Bin pill */}
        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white flex items-center space-x-1.5">
            <Award className="w-4 h-4" />
            <span>+{result.eco_points_earned || 10} Eco Points</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-white text-slate-800 text-xs font-bold shadow-sm">
            {result.disposal_guide?.bin_color || categoryMeta.binName} Bin
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Identified Item & Confidence Meter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-slate-100 pb-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Identified Waste Item
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {result.item_name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {result.disposal_guide?.primary_action}
            </p>
          </div>

          {/* Confidence Meter */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-600 flex items-center space-x-1">
                <span>AI Confidence Score</span>
                {result.is_uncertain && (
                  <span className="text-amber-600 font-semibold">(Low / Uncertain)</span>
                )}
              </span>
              <span className={`text-sm ${
                result.is_uncertain ? 'text-amber-600' : 'text-emerald-700'
              }`}>
                {confidencePercent}%
              </span>
            </div>
            
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  result.is_uncertain 
                    ? 'bg-amber-500' 
                    : confidencePercent > 80 
                    ? 'bg-emerald-500' 
                    : 'bg-teal-500'
                }`}
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Calculated via MobileNetV2 Deep Neural Network
            </p>
          </div>
        </div>

        {/* Alternative Neural Network Predictions */}
        {result.top_predictions && result.top_predictions.length > 1 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Candidate Neural Classifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {result.top_predictions.map((pred, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    i === 0 
                      ? 'bg-emerald-50/60 border-emerald-200 font-medium' 
                      : 'bg-slate-50 border-slate-200/80 text-slate-600'
                  }`}
                >
                  <span className="truncate pr-2 font-medium">{pred.label}</span>
                  <span className="font-bold text-slate-500 flex-shrink-0">
                    {Math.round(pred.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step-by-Step Proper Disposal Instructions */}
        {result.disposal_guide && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Proper Disposal Instructions
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.disposal_guide.steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 flex items-start space-x-3 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-white border border-slate-300 font-bold text-slate-600 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            {/* Do's and Don'ts Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* DOs */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Recommended (Do's)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-emerald-900/80">
                  {result.disposal_guide.dos.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DONTs */}
              <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200/80 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-red-800 uppercase tracking-wider">
                  <X className="w-4 h-4 text-red-600" />
                  <span>Avoid (Don'ts)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-red-900/80">
                  {result.disposal_guide.donts.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Environmental Impact & Decomposition Notice */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-teal-900 uppercase tracking-wider text-[11px] block">
                  Environmental Impact & Footprint
                </span>
                <p className="text-teal-800 leading-relaxed">
                  {result.disposal_guide.environmental_impact}
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-teal-200 text-teal-900 flex-shrink-0 text-center">
                <span className="block text-[10px] font-semibold text-slate-500 uppercase">
                  Decomposition Time
                </span>
                <span className="font-bold text-xs">{result.disposal_guide.decomposition_time}</span>
              </div>
            </div>
          </div>
        )}

        {/* Instant Accuracy Feedback & Scan Again Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span>Accurate prediction?</span>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => handleFeedback('accurate')}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-all flex items-center space-x-1 ${
                  feedback === 'accurate'
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold'
                    : 'bg-white border-slate-200 hover:bg-emerald-50 text-slate-600'
                }`}
                title="Accurate prediction"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Yes</span>
              </button>
              <button
                type="button"
                onClick={() => handleFeedback('inaccurate')}
                className={`px-2.5 py-1 rounded-lg border text-xs transition-all flex items-center space-x-1 ${
                  feedback === 'inaccurate'
                    ? 'bg-red-100 border-red-300 text-red-800 font-bold'
                    : 'bg-white border-slate-200 hover:bg-red-50 text-slate-600'
                }`}
                title="Report inaccurate prediction"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-red-500" />
                <span>No</span>
              </button>
            </div>
            {feedback && (
              <span className="text-[11px] text-emerald-600 font-semibold animate-fadeIn">
                Feedback saved!
              </span>
            )}
          </div>

          <button
            onClick={onScanAgain}
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
          >
            <span>Scan Another Item</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ClassificationResult;
