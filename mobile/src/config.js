import { Platform } from 'react-native';

/*
 * API URL configuration.
 *
 * Production builds use EXPO_PUBLIC_API_URL from eas.json env.
 * Dev builds auto-detect localhost / 10.0.2.2.
 *
 * After deploying backend to Render, replace PRODUCTION_API_URL below
 * with your actual Render URL (e.g. https://jobboard-backend.onrender.com/api).
 */

const PRODUCTION_API_URL = 'https://jobboard-backend.onrender.com/api';

function getApiUrl() {
  // EAS build env variable takes top priority
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Dev mode only — local dev server
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api';
    }
    return 'http://localhost:8000/api';
  }

  // Production fallback
  return PRODUCTION_API_URL;
}

export const API_BASE_URL = getApiUrl();
