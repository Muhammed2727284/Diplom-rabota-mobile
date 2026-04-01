import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Web-compatible storage wrapper
// Uses localStorage for web, SecureStore for native

export const getItemAsync = async (key) => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.log('localStorage getItem error:', e);
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
};

export const setItemAsync = async (key, value) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
      return;
    } catch (e) {
      console.log('localStorage setItem error:', e);
      return;
    }
  }
  return SecureStore.setItemAsync(key, value);
};

export const deleteItemAsync = async (key) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
      return;
    } catch (e) {
      console.log('localStorage removeItem error:', e);
      return;
    }
  }
  return SecureStore.deleteItemAsync(key);
};

export default {
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
};
