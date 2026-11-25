import React, { useState } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import ImageUploader from '../components/scanner/ImageUploader';
import CameraCapture from '../components/scanner/CameraCapture';
import ClassificationResult from '../components/scanner/ClassificationResult';
import { classifyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ScannerPage = () => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { addEcoPoints } = useAuth();

  const handleClassify = async ({ type, data, notes }) => {
    setIsClassifying(true);
    setError(null);

    try {
      let response;
      if (type === 'upload') {
        response = await classifyAPI.uploadImage(data, notes);
      } else {
        response = await classifyAPI.cameraCapture(data, notes);
      }

      setResult(response.data);
      if (response.data.eco_points_earned) {
        addEcoPoints(response.data.eco_points_earned);
      }
    } catch (err) {
      console.error('[Classification Error]:', err);
      setError(
        err.response?.data?.detail || 'Failed to process waste image. Please ensure the image is clear and try again.'
      );
    } finally {
      setIsClassifying(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Waste Classifier</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Waste Segregation Scanner
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Capture or upload an image of any waste object to identify its material, 
          bin classification, and eco disposal steps.
        </p>
      </div>

      {/* Main Workspace */}
      {!result ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          
          {/* Tabs Selector: File Upload vs Camera */}
          <div className="flex p-1 bg-slate-100 rounded-2xl max-w-sm mx-auto">
            <button
              onClick={() => {
                setActiveTab('upload');
                setError(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'upload'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('camera');
                setError(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'camera'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Camera</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Active Tab View */}
          {activeTab === 'upload' ? (
            <ImageUploader onClassify={handleClassify} isClassifying={isClassifying} />
          ) : (
            <CameraCapture onClassify={handleClassify} isClassifying={isClassifying} />
          )}

        </div>
      ) : (
        /* Result View */
        <ClassificationResult 
          result={result} 
          onScanAgain={handleReset} 
        />
      )}

    </div>
  );
};

export default ScannerPage;
