import { describe, it, expect } from 'vitest';
import {
  isValidPhone,
  isValidPincode,
  isValidEmail,
  isValidUrl,
  isValidGstin,
  isValidPan,
  isValidUpi,
  maskIdentity,
} from '../validators';
import { STRINGS } from '../../strings/hi';

describe('Validators Utility', () => {
  it('validates 10-digit Indian phone numbers', () => {
    expect(isValidPhone('9876543210')).toBe(true);
    expect(isValidPhone('6123456789')).toBe(true);
    expect(isValidPhone('5123456789')).toBe(false); // starts with 5
    expect(isValidPhone('98765')).toBe(false);
    expect(isValidPhone('98765432101')).toBe(false);
  });

  it('validates 6-digit pincodes', () => {
    expect(isValidPincode('452001')).toBe(true);
    expect(isValidPincode('110001')).toBe(true);
    expect(isValidPincode('45200')).toBe(false);
    expect(isValidPincode('4520011')).toBe(false);
    expect(isValidPincode('abc123')).toBe(false);
  });

  it('validates optional email properly', () => {
    expect(isValidEmail('')).toBe(true);
    expect(isValidEmail('info@dukaan.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });

  it('validates HTTPS URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(false);
    expect(isValidUrl('example.com')).toBe(false);
  });

  it('validates GSTIN with state code 01-37', () => {
    expect(isValidGstin('27AAACW1234A1Z5')).toBe(true); // Maharashtra (27)
    expect(isValidGstin('23AAACW1234A1Z5')).toBe(true); // MP (23)
    expect(isValidGstin('99AAACW1234A1Z5')).toBe(false); // invalid state code 99
    expect(isValidGstin('27AAACW1234A')).toBe(false);
  });

  it('validates PAN format', () => {
    expect(isValidPan('ABCDE1234F')).toBe(true);
    expect(isValidPan('ABCDE12345')).toBe(false);
    expect(isValidPan('ABCD1234F')).toBe(false);
  });

  it('validates UPI ID format', () => {
    expect(isValidUpi('sharma@upi')).toBe(true);
    expect(isValidUpi('9876543210@paytm')).toBe(true);
    expect(isValidUpi('invalid_upi')).toBe(false);
  });

  it('masks identity string properly', () => {
    expect(maskIdentity('27AAAAA1234A1Z5')).toBe('27AA•••••••••Z5');
    expect(maskIdentity('ABCDE1234F')).toBe('ABCD••••4F');
  });

  it('strictly contains zero banned strings in strings/hi.js', () => {
    const BANNED_STRINGS = [
      'CPM',
      'CTR',
      'CAC',
      'Impressions',
      'Conversions',
      'Funnel',
      'Placement',
      'Pixel',
      'Reach',
      'Inquiries',
      'Call to action',
      'Audience',
      'Targeting',
      'KYC',
      'Aadhaar',
      'आधार नंबर',
      '100% सुरक्षित',
      'सबसे ज़्यादा चुना गया',
    ];

    function extractAllStrings(obj, bucket = []) {
      if (!obj) return bucket;
      if (typeof obj === 'string') {
        bucket.push(obj);
      } else if (typeof obj === 'function') {
        // Evaluate functions with sample params
        try {
          bucket.push(String(obj(1, 2, 3)));
        } catch {}
      } else if (typeof obj === 'object') {
        for (const val of Object.values(obj)) {
          extractAllStrings(val, bucket);
        }
      }
      return bucket;
    }

    const allStrings = extractAllStrings(STRINGS);
    const corpus = allStrings.join(' ');

    for (const banned of BANNED_STRINGS) {
      const found = corpus.toLowerCase().includes(banned.toLowerCase());
      expect(found, `Found banned string in strings/hi.js: "${banned}"`).toBe(false);
    }
  });
});
