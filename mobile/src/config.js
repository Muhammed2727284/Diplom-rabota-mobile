import { Platform } from 'react-native';

/**
 * API URL configuration for different environments.
 *
 * Priority:
 *   1. EXPO_PUBLIC_API_URL env var (set via eas.json env per build profile)
 *   2. Auto-detect based on __DEV__ and Platform.OS
 *
 * For production builds: set EXPO_PUBLIC_API_URL in eas.json → build → preview/production → env
 * For local dev: auto-detects localhost / 10.0.2.2 based on platform
 */

// Production / staging URL — change this to your real server address
const PRODUCTION_API_URL = 'https://your-server.com/api';

function getDevApiUrl() {
  // Android emulator uses 10.0.2.2 to reach host machine's localhost
  // iOS simulator and web can use localhost directly
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }
  return 'http://localhost:8000/api';
}

function getApiUrl() {
  // EAS build env variable takes top priority (EXPO_PUBLIC_ prefix required for Expo SDK 49+)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // In dev mode, auto-detect the right local URL
  if (__DEV__) {
    return getDevApiUrl();
  }

  // Production fallback
  return PRODUCTION_API_URL;
}

export const API_BASE_URL = getApiUrl();
export default { API_BASE_URL };
