import React, { useRef, useState } from 'react';
import { Camera, X, RefreshCw, AlertCircle, CheckCircle, Video } from 'lucide-react';
import { processImageFile } from '../../utils/imageTools';
import { useAdvertiserV2 } from '../../context/AdvertiserV2Context';
import { track } from '../../utils/track';
import { STRINGS } from '../../strings/hi';

export default function MediaSlot({
  mediaItem = null,
  onUploaded,
  onRemove,
  aspectRatio = '16/9',
  slotLabel = 'फोटो जोड़ें',
  isVideo = false,
  className = '',
}) {
  const { state } = useAdvertiserV2();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [qualityNote, setQualityNote] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setQualityNote(null);
    setLoading(true);
    setProgress(20);
    track('upload_start', { name: file.name, isVideo });

    // Handle video validation
    if (isVideo) {
      if (file.size > 50 * 1024 * 1024) {
        setError(STRINGS.ad.videoSizeError);
        setLoading(false);
        track('upload_error', { reason: 'size' });
        return;
      }

      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      const objUrl = URL.createObjectURL(file);

      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > 60) {
          setError(STRINGS.ad.videoLengthError);
          setLoading(false);
          track('upload_error', { reason: 'duration' });
          return;
        }

        // Check vertical video (width <= height)
        if (videoElement.videoWidth > videoElement.videoHeight) {
          setError(STRINGS.ad.videoAspectError);
          setLoading(false);
          track('upload_error', { reason: 'aspect_ratio' });
          return;
        }

        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          onUploaded({
            objectUrl: objUrl,
            w: videoElement.videoWidth,
            h: videoElement.videoHeight,
            durationSec: Math.round(videoElement.duration),
            name: file.name,
          });
          track('upload_complete', { isVideo: true });
        }, 500);
      };

      videoElement.src = objUrl;
      return;
    }

    // Handle image upload with simulation fail check
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(90, p + 25));
    }, 200);

    try {
      if (state.sim?.uploadFails) {
        throw new Error(STRINGS.ad.uploadErrorMsg);
      }

      const processed = await processImageFile(file);
      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setLoading(false);
        onUploaded(processed);
        track('upload_complete', { isVideo: false });

        // Quality check on short edge
        const shorter = Math.min(processed.w, processed.h);
        if (shorter < 600) {
          setQualityNote({ type: 'warn', text: STRINGS.ad.photoSmallWarn });
        } else {
          setQualityNote({ type: 'success', text: STRINGS.ad.photoCleanSuccess });
        }
      }, 400);
    } catch (err) {
      clearInterval(progressInterval);
      setLoading(false);
      setError(STRINGS.ad.uploadErrorMsg);
      track('upload_error', { reason: err.message });
    }
  };

  const hasMedia = !!(mediaItem?.dataUrl || mediaItem?.objectUrl);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div
        className={`w-full rounded-[18px] overflow-hidden border-2 relative select-none flex items-center justify-center transition-all ${
          hasMedia
            ? 'border-solid border-[#E5E7EB] bg-black/5'
            : 'border-dashed border-[#D1D5DB] bg-[#F7F7F4] hover:bg-neutral-100 cursor-pointer'
        }`}
        style={{ aspectRatio }}
        onClick={() => !hasMedia && !loading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={isVideo ? 'video/*' : 'image/*'}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Loading / Progress State */}
        {loading && (
          <div className="absolute inset-0 bg-[#F8F8F4] flex flex-col items-center justify-center gap-2 p-4 z-10">
            <div className="w-8 h-8 rounded-full border-3 border-[#E39026] border-t-transparent animate-spin" />
            <div className="w-2/3 h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div
                className="h-full bg-[#E39026] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[12px] text-[#6B7280]">अपलोड हो रहा है…</span>
          </div>
        )}

        {/* Error State with Retry Button */}
        {error && (
          <div className="absolute inset-0 bg-[#FEF2F2] flex flex-col items-center justify-center gap-2 p-3 text-center z-10">
            <AlertCircle className="w-6 h-6 text-[#DC2626]" />
            <span className="text-[12.5px] font-medium text-[#DC2626]">{error}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-3 py-1 rounded-full bg-white border border-[#FECACA] text-[12px] font-semibold text-[#DC2626] shadow-xs active:scale-95"
            >
              {STRINGS.ad.retryUpload}
            </button>
          </div>
        )}

        {/* Loaded Media Preview */}
        {hasMedia && !loading && (
          <div className="w-full h-full relative group">
            {isVideo ? (
              <video
                src={mediaItem.objectUrl}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <img
                src={mediaItem?.dataUrl || mediaItem?.objectUrl || ''}
                alt=""
                className="w-full h-full object-cover"
              />
            )}

            {/* Action buttons: Replace and Remove */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 active:scale-90"
                aria-label="फोटो बदलें"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 active:scale-90"
                  aria-label="हटाएँ"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty Slot Placeholder */}
        {!hasMedia && !loading && !error && (
          <div className="flex flex-col items-center justify-center gap-1.5 text-[#6B7280] p-4 text-center">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#2B2437] shadow-xs">
              {isVideo ? <Video className="w-5 h-5 text-[#E39026]" /> : <Camera className="w-5 h-5 text-[#E39026]" />}
            </div>
            <span className="text-[13px] font-semibold text-[#2B2437]">{slotLabel}</span>
          </div>
        )}
      </div>

      {/* Quality Feedback */}
      {qualityNote && (
        <div
          className={`flex items-center gap-1.5 text-[12px] px-1 font-medium ${
            qualityNote.type === 'warn' ? 'text-[#C97F1E]' : 'text-[#2F8F5B]'
          }`}
        >
          {qualityNote.type === 'warn' ? (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{qualityNote.text}</span>
        </div>
      )}
    </div>
  );
}
