/**
 * Global State Management
 * Enhanced Zustand store with persistence and additional features
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Prediction {
  label: string;
  confidence: number;
  prob_fake: number;
  prob_real: number;
  original_length: number;
  cleaned_length: number;
  timestamp?: number;
}

interface PredictionStore {
  // State
  inputText: string;
  prediction: Prediction | null;
  isLoading: boolean;
  error: string | null;
  history: Prediction[];
  darkMode: boolean;
  soundEnabled: boolean;
  totalAnalyzed: number;
  
  // Actions
  setInputText: (text: string) => void;
  setPrediction: (prediction: Prediction | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addToHistory: (prediction: Prediction) => void;
  removeFromHistory: (index: number) => void;
  clearHistory: () => void;
  reset: () => void;
  setDarkMode: (dark: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  incrementAnalyzed: () => void;
}

export const usePredictionStore = create<PredictionStore>()(
  persist(
    (set, get) => ({
      inputText: '',
      prediction: null,
      isLoading: false,
      error: null,
      history: [],
      darkMode: true,
      soundEnabled: false,
      totalAnalyzed: 0,
      
      setInputText: (text) => set({ inputText: text }),
      
      setPrediction: (prediction) => {
        if (prediction) {
          prediction.timestamp = Date.now();
        }
        set({ prediction });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      addToHistory: (prediction) =>
        set((state) => ({
          history: [
            { ...prediction, timestamp: Date.now() },
            ...state.history
          ].slice(0, 20), // Keep last 20 predictions
          totalAnalyzed: state.totalAnalyzed + 1,
        })),
      
      removeFromHistory: (index) =>
        set((state) => ({
          history: state.history.filter((_, i) => i !== index),
        })),
      
      clearHistory: () => set({ history: [] }),
      
      reset: () =>
        set({
          inputText: '',
          prediction: null,
          isLoading: false,
          error: null,
        }),
      
      setDarkMode: (dark) => set({ darkMode: dark }),
      
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      
      incrementAnalyzed: () =>
        set((state) => ({ totalAnalyzed: state.totalAnalyzed + 1 })),
    }),
    {
      name: 'fake-news-detector-storage',
      partialize: (state) => ({
        history: state.history,
        darkMode: state.darkMode,
        soundEnabled: state.soundEnabled,
        totalAnalyzed: state.totalAnalyzed,
      }),
    }
  )
);
