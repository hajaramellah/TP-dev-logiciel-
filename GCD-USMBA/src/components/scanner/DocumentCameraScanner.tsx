import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  RefreshCw,
  Upload,
  CheckCircle2,
  AlertCircle,
  Scan,
  Sparkles,
  VideoOff,
  Video,
  Monitor,
  Settings2
} from 'lucide-react';

interface DocumentCameraScannerProps {
  documentLabel: string;
  documentType: 'cin' | 'student-card';
  onCaptureCompleted: (imageBase64: string) => void;
  isProcessing?: boolean;
}

interface VideoDevice {
  deviceId: string;
  label: string;
}

export const DocumentCameraScanner: React.FC<DocumentCameraScannerProps> = ({
  documentLabel,
  documentType,
  onCaptureCompleted,
  isProcessing = false
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<
    'permission' | 'not_found' | 'busy' | 'unsupported' | 'security' | 'general' | null
  >(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [availableDevices, setAvailableDevices] = useState<VideoDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  // Stop active stream cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping track:', e);
        }
      });
      streamRef.current = null;
    }
    setStream(null);
    setIsCameraActive(false);
    setIsVideoReady(false);
    setVideoDimensions(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Enumerate all available video devices
  const updateDeviceList = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return;
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices
        .filter((d) => d.kind === 'videoinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Caméra ${index + 1} (${d.deviceId ? d.deviceId.slice(0, 5) : 'par défaut'})`
        }));
      setAvailableDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('Erreur lors de la détection des caméras:', err);
    }
  }, [selectedDeviceId]);

  // Progressive camera initialization with automatic constraint fallbacks
  const startCamera = useCallback(
    async (targetDeviceId?: string) => {
      stopCamera();
      setCameraError(null);
      setErrorType(null);
      setIsStarting(true);

      const deviceIdToUse = targetDeviceId || selectedDeviceId;

      // 1. Check browser mediaDevices support & context
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsStarting(false);
        setErrorType('unsupported');
        setCameraError(
          "L'API caméra n'est pas prise en charge par ce navigateur ou est bloquée par le contexte HTTP. Utilisez un navigateur récent (Chrome, Edge, Firefox, Safari) sous HTTPS."
        );
        return;
      }

      // Check secure context
      if (window.isSecureContext === false && window.location.hostname !== 'localhost') {
        setIsStarting(false);
        setErrorType('security');
        setCameraError(
          "L'accès à la caméra nécessite un contexte sécurisé HTTPS. Votre connexion actuelle n'est pas sécurisée."
        );
        return;
      }

      let mediaStream: MediaStream | null = null;

      // Tiered fallback constraints
      const constraintPlans: MediaStreamConstraints[] = [
        // Plan 1: Ideal 1080p/720p with selected device
        deviceIdToUse
          ? {
              video: {
                deviceId: { exact: deviceIdToUse },
                width: { ideal: 1280 },
                height: { ideal: 720 }
              },
              audio: false
            }
          : {
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
              },
              audio: false
            },
        // Plan 2: Relaxed resolution with selected device
        deviceIdToUse
          ? {
              video: { deviceId: { exact: deviceIdToUse } },
              audio: false
            }
          : {
              video: { width: { ideal: 640 }, height: { ideal: 480 } },
              audio: false
            },
        // Plan 3: Universal fallback - ANY available camera on computer
        {
          video: true,
          audio: false
        }
      ];

      let lastError: any = null;

      for (const constraints of constraintPlans) {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
          if (mediaStream) break;
        } catch (err: any) {
          lastError = err;
          // If permission explicitly denied or device busy, no need to retry other constraints
          if (
            err.name === 'NotAllowedError' ||
            err.name === 'PermissionDeniedError' ||
            err.name === 'NotReadableError' ||
            err.name === 'TrackStartError'
          ) {
            break;
          }
          // Continue to next constraint plan if OverconstrainedError or NotFoundError with specific ID
        }
      }

      setIsStarting(false);

      if (!mediaStream) {
        console.error('All camera constraint plans failed:', lastError);
        const errName = lastError?.name || '';
        const errMsg = lastError?.message || '';

        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setErrorType('permission');
          setCameraError(
            "Accès à la caméra refusé. Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur (cliquez sur le cadenas ou l'icône caméra dans la barre d'adresse)."
          );
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setErrorType('not_found');
          setCameraError(
            "Aucune caméra détectée sur votre ordinateur. Veuillez brancher une webcam ou vérifier que le pilote est actif."
          );
        } else if (errName === 'NotReadableError' || errName === 'TrackStartError') {
          setErrorType('busy');
          setCameraError(
            "La caméra est actuellement occupée par une autre application (Zoom, Microsoft Teams, Google Meet, ou un autre onglet). Veuillez la fermer et réessayer."
          );
        } else if (errName === 'SecurityError') {
          setErrorType('security');
          setCameraError(
            "L'accès à la caméra est bloqué par la politique de sécurité du navigateur (Permissions Policy)."
          );
        } else {
          setErrorType('general');
          setCameraError(
            `Impossible d'activer la caméra (${errMsg || errName || 'Erreur inconnue'}). Vous pouvez utiliser l'importation de photo.`
          );
        }
        setIsCameraActive(false);
        return;
      }

      // Stream successfully acquired
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsCameraActive(true);

      // Refresh device list now that permissions have been granted (labels will be revealed)
      updateDeviceList();

      // Connect to video element
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('playsinline', 'true');

        video
          .play()
          .then(() => {
            // Wait for video dimension metadata
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
              setIsVideoReady(true);
            }
          })
          .catch((playErr) => {
            console.warn('Video play() call was interrupted:', playErr);
          });
      }
    },
    [selectedDeviceId, stopCamera, updateDeviceList]
  );

  // Hook stream into video element whenever stream changes or video element mounts
  useEffect(() => {
    if (videoRef.current && stream) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');

      video
        .play()
        .then(() => {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
            setIsVideoReady(true);
          }
        })
        .catch((e) => console.warn('Video auto-playback warning:', e));
    }
  }, [stream]);

  // Handle video metadata loaded
  const handleVideoMetadataLoaded = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
        setIsVideoReady(true);
      }
    }
  };

  // Mount/Unmount cleanup
  useEffect(() => {
    // Initial devices enumeration
    updateDeviceList();

    // Start camera automatically on mount
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  // Switch camera device
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    startCamera(newDeviceId);
  };

  // Image quality report
  const [imageQuality, setImageQuality] = useState<{
    width: number;
    height: number;
    brightness: number;
    isDark: boolean;
    isOverexposed: boolean;
    message: string;
  } | null>(null);

  // High-fidelity frame capture
  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    // Use offscreen canvas for max fidelity
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw pristine video frame
      ctx.drawImage(video, 0, 0, width, height);

      // Analyze image quality (brightness / luminance)
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const pixels = imgData.data;
        let totalLum = 0;
        let count = 0;
        for (let i = 0; i < pixels.length; i += 64) {
          totalLum += 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
          count++;
        }
        const avgBrightness = count > 0 ? Math.round(totalLum / count) : 128;
        const isDark = avgBrightness < 40;
        const isOverexposed = avgBrightness > 235;

        let msg = 'Luminosité et définition optimales pour l\'analyse OCR.';
        if (isDark) {
          msg = "Image plutôt sombre. Si la reconnaissance échoue, réessayez avec un meilleur éclairage.";
        } else if (isOverexposed) {
          msg = "Reflet ou surexposition détecté. Évitez les reflets directs de lumière sur la carte.";
        }

        setImageQuality({
          width,
          height,
          brightness: avgBrightness,
          isDark,
          isOverexposed,
          message: msg,
        });
      } catch (e) {
        console.warn('Image quality check skipped:', e);
      }

      // High-grade JPEG compression (0.95 quality)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setCapturedImage(dataUrl);

      // Stop camera hardware stream immediately after capture to release webcam LED
      stopCamera();
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setImageQuality(null);
    startCamera();
  };

  // Handle manual file upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 1280;
        const h = img.naturalHeight || 720;
        setImageQuality({
          width: w,
          height: h,
          brightness: 128,
          isDark: false,
          isOverexposed: false,
          message: 'Fichier image importé avec succès. Prêt pour l\'analyse OCR.',
        });
      };
      img.src = result;
      setCapturedImage(result);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Submit capture for OCR
  const handleConfirmAndProcess = () => {
    if (capturedImage) {
      onCaptureCompleted(capturedImage);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl border border-slate-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Scan className="w-3.5 h-3.5" />
            Scanner Numérique Haute Définition
          </div>
          <h3 className="text-lg sm:text-xl font-bold mt-2">
            Numérisation de {documentLabel}
          </h3>
          <p className="text-xs text-slate-400">
            Cadrez le document dans le rectangle lumineux, bien net, sans reflets et à la lumière.
          </p>
        </div>

        {/* Quick controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Multiple camera selector */}
          {availableDevices.length > 1 && !capturedImage && (
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200">
              <Settings2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <select
                value={selectedDeviceId}
                onChange={handleDeviceChange}
                className="bg-transparent border-none text-xs text-slate-200 focus:outline-hidden font-medium cursor-pointer"
                title="Choisir la caméra"
              >
                {availableDevices.map((d, i) => (
                  <option key={d.deviceId || i} value={d.deviceId} className="bg-slate-900 text-white">
                    {d.label || `Caméra ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Toggle stream button */}
          {!capturedImage && (
            isCameraActive ? (
              <button
                type="button"
                onClick={stopCamera}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
                title="Désactiver la caméra"
              >
                <VideoOff className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">Arrêter la caméra</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startCamera()}
                disabled={isStarting}
                className="p-2.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                title="Activer la caméra"
              >
                <Video className="w-4 h-4" />
                <span>{isStarting ? 'Démarrage...' : 'Démarrer la caméra'}</span>
              </button>
            )
          )}

          {/* Manual file upload fallback */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Importer une photo depuis l'ordinateur"
          >
            <Upload className="w-4 h-4" />
            <span>Fichier photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden bg-black border-2 border-slate-700 flex items-center justify-center">
        {/* State 1: Captured Image Preview */}
        {capturedImage ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              src={capturedImage}
              alt="Capture du document"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <div className="bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                Capture réussie
              </div>
              {imageQuality && (
                <div
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shadow-md ${
                    imageQuality.isDark || imageQuality.isOverexposed
                      ? 'bg-amber-500/90 text-slate-950 border-amber-400'
                      : 'bg-slate-900/80 text-teal-300 border-teal-500/40'
                  }`}
                >
                  {imageQuality.width}×{imageQuality.height} px •{' '}
                  {imageQuality.isDark
                    ? 'Luminosité sombre'
                    : imageQuality.isOverexposed
                    ? 'Reflet détecté'
                    : 'HD Limpide'}
                </div>
              )}
            </div>
            {imageQuality && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-xs p-2.5 rounded-xl text-[11px] text-slate-200 text-center border border-white/10 shadow-lg">
                {imageQuality.message}
              </div>
            )}
          </div>
        ) : (
          /* State 2 & 3: Live Video or Fallback Overlay */
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {/* Always mounted video element ensures no React ref race condition */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={handleVideoMetadataLoaded}
              onCanPlay={handleVideoMetadataLoaded}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isCameraActive && isVideoReady ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
              }`}
            />

            {/* When Camera is active and video is streaming */}
            {isCameraActive && isVideoReady && (
              <>
                {/* Visual card placement guide */}
                <div className="absolute inset-8 sm:inset-12 border-2 border-dashed border-teal-400/90 rounded-2xl pointer-events-none flex flex-col justify-between p-4 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                  <div className="flex justify-between items-center text-[11px] font-mono text-teal-300 font-bold bg-slate-950/80 px-2.5 py-1 rounded-md self-start border border-teal-500/30">
                    <span>
                      {documentType === 'cin' ? 'CARTE NATIONALE (CIN)' : "CARTE D'ÉTUDIANT / ATTESTATION"}
                    </span>
                  </div>
                  <div className="text-center text-xs text-white/95 bg-slate-950/80 py-1.5 px-4 rounded-xl self-center border border-white/10 shadow-sm">
                    Cadrez la carte entière à l'intérieur du rectangle
                  </div>
                </div>

                {/* Status indicator badge */}
                <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-xs px-3 py-1 rounded-full border border-teal-500/40 flex items-center gap-2 text-[11px] text-teal-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Flux direct{' '}
                    {videoDimensions ? `${videoDimensions.width}×${videoDimensions.height}` : 'HD'}
                  </span>
                </div>
              </>
            )}

            {/* When Camera is loading or starting */}
            {isStarting && (
              <div className="p-8 text-center space-y-3 max-w-md">
                <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">
                  Connexion à la webcam de votre ordinateur en cours...
                </p>
                <p className="text-[11px] text-slate-500">
                  Veuillez accepter la demande d'autorisation d'accès si le navigateur vous le demande.
                </p>
              </div>
            )}

            {/* When Camera is inactive or in error */}
            {!isStarting && (!isCameraActive || !isVideoReady) && (
              <div className="p-8 text-center space-y-4 max-w-md">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-teal-400 border border-slate-700 shadow-inner">
                  {cameraError ? (
                    <AlertCircle className="w-7 h-7 text-rose-400" />
                  ) : (
                    <Camera className="w-7 h-7" />
                  )}
                </div>

                {cameraError ? (
                  <div className="space-y-3 bg-rose-950/40 border border-rose-800/60 p-4 rounded-2xl text-left">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-rose-200">
                          {errorType === 'permission'
                            ? 'Autorisation caméra requise'
                            : errorType === 'busy'
                            ? 'Caméra déjà utilisée'
                            : errorType === 'not_found'
                            ? 'Aucune caméra trouvée'
                            : errorType === 'security'
                            ? 'Contexte non sécurisé'
                            : 'Caméra indisponible'}
                        </h4>
                        <p className="text-[11px] text-rose-300/90 leading-relaxed">
                          {cameraError}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startCamera()}
                        className="bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Réessayer la caméra</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs px-4 py-2 rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Téléverser une photo</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-300">
                      La caméra de votre ordinateur est prête à être activée pour le scan.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => startCamera()}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md inline-flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Démarrer la caméra physique</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all border border-slate-700 inline-flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Choisir un fichier</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hidden Canvas for capture rendering */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            {isCameraActive && isVideoReady
              ? 'Webcam active : stabilisez le document dans le cadre puis cliquez sur Capturer.'
              : 'La reconnaissance OCR sera effectuée dès la validation de la capture.'}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                disabled={isProcessing}
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
              >
                Reprendre la photo
              </button>
              <button
                type="button"
                onClick={handleConfirmAndProcess}
                disabled={isProcessing}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Traitement OCR en cours...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 text-slate-950" />
                    <span>Lancer la reconnaissance OCR →</span>
                  </>
                )}
              </button>
            </>
          ) : (
            isCameraActive && isVideoReady ? (
              <button
                type="button"
                onClick={handleCapture}
                className="w-full sm:w-auto px-8 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-2xl text-xs font-black shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Camera className="w-5 h-5 text-slate-950" />
                <span>Capturer le document</span>
              </button>
            ) : !isCameraActive && (
              <button
                type="button"
                onClick={() => startCamera()}
                disabled={isStarting}
                className="w-full sm:w-auto px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>{isStarting ? 'Connexion en cours...' : 'Activer la webcam'}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
