/**
 * Input Section Component
 * Text input area with validation and animations
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle } from 'lucide-react';
import { usePredictionStore } from '../store/predictionStore';
import { predictionApi } from '../utils/api';
import { toast } from 'sonner';
import axios from 'axios';

const InputSection = () => {
  const { inputText, setInputText, setLoading, setPrediction, addToHistory, setError } =
    usePredictionStore();
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 5000;
  const MIN_CHARS = 10;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setCharCount(text.length);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      setCharCount(text.length);
      toast.success('Text pasted successfully');
    } catch (err) {
      toast.error('Unable to paste. Please try again.');
    }
  };

  const handleAnalyze = async () => {
    if (inputText.length < MIN_CHARS) {
      setError(`Text must be at least ${MIN_CHARS} characters`);
      toast.error(`Text must be at least ${MIN_CHARS} characters`);
      return;
    }

    if (inputText.length > MAX_CHARS) {
      setError(`Text cannot exceed ${MAX_CHARS} characters`);
      toast.error(`Text cannot exceed ${MAX_CHARS} characters`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await predictionApi.predict(inputText);
      setPrediction(result);
      addToHistory(result);
      toast.success('Analysis complete!');
    } catch (err: unknown) {
      const errorMsg = axios.isAxiosError(err)
        ? (err.response?.data as { detail?: string } | undefined)?.detail ||
          'Failed to analyze. Please try again.'
        : 'Failed to analyze. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isValid = inputText.length >= MIN_CHARS && inputText.length <= MAX_CHARS;
  const percent = (charCount / MAX_CHARS) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel"
    >
      <div className="p-6 sm:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Analyze Article</h2>
          <p className="text-gray-400">Paste or type a news article to detect if it's fake or real</p>
        </div>

        {/* Input Area */}
        <div className="relative mb-4">
          <textarea
            value={inputText}
            onChange={handleChange}
            placeholder="Paste your news article here... (minimum 10 characters)"
            className="w-full h-40 sm:h-48 p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
          />

          {/* Character Count Bar */}
          <motion.div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {charCount} / {MAX_CHARS}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className={`h-full transition-colors ${
              isValid ? 'bg-success-500' : percent > 90 ? 'bg-danger-500' : 'bg-brand-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>

        {/* Warnings */}
        {charCount < MIN_CHARS && charCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm text-yellow-400 mb-4"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Add {MIN_CHARS - charCount} more characters to analyze</span>
          </motion.div>
        )}

        {charCount > MAX_CHARS && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm text-danger-500 mb-4"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Text exceeds maximum length by {charCount - MAX_CHARS} characters</span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={!isValid}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            <Send className="w-4 h-4" />
            Analyze
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePaste}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm border border-white/20 transition-all"
          >
            Paste
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setInputText('');
              setCharCount(0);
              setPrediction(null);
            }}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 font-semibold rounded-lg border border-white/10 transition-all"
          >
            Clear
          </motion.button>
        </div>

        {/* Sample Inputs */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-3">Quick samples:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Load Fake News Sample',
              'Load Real News Sample',
            ].map((label, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const sampleText = i === 0 
                    ? "SHOCKING: Scientists CONFIRM that 5G towers are secretly spreading a new virus to control the population! Government hiding the TRUTH from you."
                    : "The Federal Reserve raised interest rates by 25 basis points on Wednesday, citing persistent inflation concerns.";
                  setInputText(sampleText);
                  setCharCount(sampleText.length);
                }}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-xs text-brand-400 border border-brand-500/30 rounded-lg transition-all"
              >
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InputSection;
