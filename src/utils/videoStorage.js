/**
 * videoStorage.js
 * Persistent client-side IndexedDB storage for citizen-uploaded videos and real video thumbnail extraction.
 * Ensures that uploaded videos survive page refreshes, HMR, and navigation without losing their blob references.
 */

const DB_NAME = 'nb_citizen_media_db';
const STORE_NAME = 'uploaded_videos';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Persist a video File/Blob in IndexedDB keyed by report ID.
 */
export async function storeUploadedVideo(reportId, fileOrBlob) {
  if (!reportId || !fileOrBlob) return false;
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(fileOrBlob, reportId);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('Failed to store video in IndexedDB:', err);
    return false;
  }
}

/**
 * Retrieve a stored video Blob from IndexedDB.
 */
export async function getUploadedVideo(reportId) {
  if (!reportId) return null;
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(reportId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Failed to retrieve video from IndexedDB:', err);
    return null;
  }
}

/**
 * Generate a real, high-quality poster thumbnail snapshot from a video File or blob URL.
 */
export function extractVideoThumbnail(fileOrUrl) {
  return new Promise((resolve) => {
    try {
      const url = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.src = url;

      let cleanedUp = false;
      const cleanup = () => {
        if (!cleanedUp) {
          cleanedUp = true;
          if (typeof fileOrUrl !== 'string') {
            URL.revokeObjectURL(url);
          }
        }
      };

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, (video.duration || 2) / 2);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 360;
          canvas.height = video.videoHeight || 640;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          cleanup();
          resolve(dataUrl);
        } catch {
          cleanup();
          resolve('');
        }
      };

      video.onerror = () => {
        cleanup();
        resolve('');
      };

      // Fallback timeout after 3 seconds
      setTimeout(() => {
        cleanup();
        resolve('');
      }, 3000);
    } catch {
      resolve('');
    }
  });
}
