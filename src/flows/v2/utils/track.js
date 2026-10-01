/**
 * Lightweight in-memory and localStorage event tracker for Flow B.
 */

const STORAGE_KEY = 'nb2_events';
const MAX_EVENTS = 500;

let inMemoryEvents = [];

// Initialize from localStorage if present
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    inMemoryEvents = JSON.parse(saved);
  }
} catch {
  inMemoryEvents = [];
}

export function track(name, props = {}) {
  const event = {
    name,
    props,
    at: new Date().toISOString(),
  };

  inMemoryEvents.push(event);
  if (inMemoryEvents.length > MAX_EVENTS) {
    inMemoryEvents = inMemoryEvents.slice(-MAX_EVENTS);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryEvents));
  } catch {
    // ignore quota errors
  }

  if (import.meta.env?.DEV) {
    console.debug(`[Flow B Track] ${name}`, props);
  }
}

export function getEventLog() {
  return [...inMemoryEvents];
}

export function clearEventLog() {
  inMemoryEvents = [];
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function downloadEventLog() {
  const data = JSON.stringify(inMemoryEvents, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `flow-b-events-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
