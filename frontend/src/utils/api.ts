/**
 * API Client Configuration
 * Centralized API communication
 */

import axios, { AxiosInstance } from 'axios';

const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : import.meta.env.VITE_API_URL;

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
apiClient.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.data);
    return response;
  },
  (error) => {
    console.error(`[API] Error:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface PredictionRequest {
  text: string;
}

export interface PredictionResponse {
  label: string;
  confidence: number;
  prob_fake: number;
  prob_real: number;
  original_length: number;
  cleaned_length: number;
}

export const predictionApi = {
  predict: async (text: string): Promise<PredictionResponse> => {
    const response = await apiClient.post<PredictionResponse>('/predict', { text });
    return response.data;
  },

  health: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};
