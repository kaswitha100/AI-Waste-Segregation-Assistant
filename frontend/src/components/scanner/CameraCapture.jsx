import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Sparkles, AlertCircle, SwitchCamera, Check } from 'lucide-react';

const CameraCapture = ({ onClassify, isClassifying }) => {
  const [streamActive, setStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' or 'user'
  const [permissionError, setPermissionError] = useState(null);
  const [notes, setNotes] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async (facingMode = 'environment') => {
    stopCamera();
    setPermissionError(null);
    try {
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setStreamActive(true);
    } catch (err) {
      console.error('[Webcam Error]:', err);
      setPermissionError(
        'Unable to access camera. Please allow camera permissions in your browser or try the file upload mode.'
      );
      setStreamActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setStreamActive(false);
  };

  useEffect(() => {
    startCamera(cameraFacing);
    return () => {
      stopCamera();
    };
  }, [cameraFacing]);

  const toggleFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
  };

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Data = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(base64Data);
    stopCamera();
  };

  const retakeSnapshot = () => {
    setCapturedImage(null);
    startCamera(cameraFacing);
  };

  const handleClassify = () => {
    if (!capturedImage) return;
    onClassify({
      type: 'camera',
      data: capturedImage,
      notes: notes || 'Live camera capture'
    });
  };

  return (
    <div className="space-y-4">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {permissionError ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Camera Permission Required</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">{permissionError}</p>
          <button
            onClick={() => startCamera(cameraFacing)}
            className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Camera</span>
          </button>
        </div>
      ) : !capturedImage ? (
        /* Live Camera Viewfinder */
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-[460px] shadow-lg flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Scanner Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-emerald-400/80 rounded-3xl shadow-inner">
              {/* Corner markers */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />

              {/* Animated scan line */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-line shadow-[0_0_15px_#10B981]" />

              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="px-3 py-1 rounded-full bg-black/60 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
                  Center Waste Object In Frame
                </span>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-6 px-4">
            <button
              onClick={toggleFacing}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
              title="Flip camera"
            >
              <SwitchCamera className="w-5 h-5" />
            </button>

            {/* Shutter Button */}
            <button
              onClick={captureSnapshot}
              className="w-16 h-16 rounded-full bg-white p-1.5 shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              title="Take Photo"
            >
              <div className="w-full h-full rounded-full border-4 border-emerald-600 bg-emerald-500 flex items-center justify-center text-white">
                <Camera className="w-6 h-6" />
              </div>
            </button>

            <button
              onClick={() => startCamera(cameraFacing)}
              className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
              title="Reload stream"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Captured Snapshot Preview */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="relative aspect-video max-h-80 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
            <img
              src={capturedImage}
              alt="Captured Frame"
              className="w-full h-full object-contain"
            />
            <button
              onClick={retakeSnapshot}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              title="Retake photo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Optional Item Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Empty milk carton, kitchen vegetable peels..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={retakeSnapshot}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake Photo</span>
              </button>

              <button
                type="button"
                onClick={handleClassify}
                disabled={isClassifying}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/30 flex items-center space-x-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
              >
                {isClassifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Frame...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Classify Waste Snapshot</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
