import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createUser = async (userData) => {
  const response = await api.post('/api/users', userData);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/api/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, profileData) => {
  const response = await api.put(`/api/users/${userId}`, profileData);
  return response.data;
};

export const getHooks = async (params = {}) => {
  const response = await api.get('/api/hooks', { params });
  return response.data;
};

export const createHook = async (hookData) => {
  const response = await api.post('/api/hooks', hookData);
  return response.data;
};

export const likeHook = async (hookId, userId) => {
  const response = await api.post(`/api/hooks/${hookId}/like`, { userId });
  return response.data;
};

export const replyToHook = async (hookId, userId, content) => {
  const response = await api.post(`/api/hooks/${hookId}/reply`, { userId, content });
  return response.data;
};

export const getMatches = async (userId) => {
  const response = await api.get(`/api/matches/${userId}`);
  return response.data;
};

export const createMatch = async (userId1, userId2) => {
  const response = await api.post('/api/matches', { userId1, userId2 });
  return response.data;
};

export const getMessages = async (matchId) => {
  const response = await api.get(`/api/messages/${matchId}`);
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await api.post('/api/messages', messageData);
  return response.data;
};

export const blockUser = async (userId, blockedUserId) => {
  const response = await api.post(`/api/users/${userId}/block`, { blockedUserId });
  return response.data;
};

export const reportUser = async (userId, reportedUserId, reason) => {
  const response = await api.post(`/api/users/${userId}/report`, { reportedUserId, reason });
  return response.data;
};

export const getNearbyUsers = async (latitude, longitude, radius = 500) => {
  const response = await api.get('/api/users/nearby', {
    params: { latitude, longitude, radius },
  });
  return response.data;
};

