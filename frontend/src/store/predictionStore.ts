/**
 * Global State Management
 * Zustand store for prediction state
 */

import { create } from 'zustand';

export interface Prediction {
  label: string;
  confidence: number;
  prob_fake: number;
  prob_real: number;
  original_length: number;
  cleaned_length: number;
}

interface PredictionStore {
  // State
  inputText: string;
  prediction: Prediction | null;
  isLoading: boolean;
  error: string | null;
  history: Prediction[];
  
  // Actions
  setInputText: (text: string) => void;
  setPrediction: (prediction: Prediction | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (prediction: Prediction) => void;
  clearHistory: () => void;
  reset: () => void;
}

export const usePredictionStore = create<PredictionStore>((set) => ({
  inputText: '',
  prediction: null,
  isLoading: false,
  error: null,
  history: [],
  
  setInputText: (text) => set({ inputText: text }),
  setPrediction: (prediction) => set({ prediction }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  addToHistory: (prediction) =>
    set((state) => ({
      history: [prediction, ...state.history].slice(0, 10),
    })),
  clearHistory: () => set({ history: [] }),
  reset: () =>
    set({
      inputText: '',
      prediction: null,
      isLoading: false,
      error: null,
    }),
}));
