/**
 * Input Section Component
 * Enhanced with animations, themes, and additional features
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, Mic, MicOff, Copy, FileText, Sparkles } from 'lucide-react';
import { usePredictionStore } from '../store/predictionStore';
import { predictionApi } from '../utils/api';
import { toast } from 'sonner';
import axios from 'axios';

interface InputSectionProps {
  darkMode: boolean;
}

const InputSection = ({ darkMode }: InputSectionProps) => {
  const { inputText, setInputText, setLoading, setPrediction, addToHistory, setError, prediction } =
    usePredictionStore();
  const [charCount, setCharCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_CHARS = 5000;
  const MIN_CHARS = 10;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setInputText(text);
      setCharCount(text.length);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      setCharCount(text.length);
      toast.success('Text pasted from clipboard!', {
        icon: '📋',
      });
    } catch (err) {
      toast.error('Unable to paste. Please try again.');
    }
  };

  const handleCopy = async () => {
    if (inputText) {
      await navigator.clipboard.writeText(inputText);
      toast.success('Text copied to clipboard!');
    }
  };

  // Speech Recognition
  const handleSpeechToText = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
        setCharCount(transcript.length);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition error');
      };
    }
  };

  const handleAnalyze = async () => {
    if (inputText.length < MIN_CHARS) {
      setError(`Text must be at least ${MIN_CHARS} characters`);
      toast.error(`Minimum ${MIN_CHARS} characters required`);
      return;
    }

    setShowAnimation(true);
    setIsAnalyzing(true);

    try {
      setLoading(true);
      setError(null);
      
      const result = await predictionApi.enhancedPredict(inputText, true);
      setPrediction(result);
      addToHistory(result);
      toast.success('Analysis complete!', {
        icon: '✅',
      });
    } catch (err: unknown) {
      const errorMsg = axios.isAxiosError(err)
        ? (err.response?.data as { detail?: string } | undefined)?.detail ||
          'Failed to analyze. Please try again.'
        : 'Failed to analyze. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
      setTimeout(() => setShowAnimation(false), 500);
    }
  };

  const isValid = inputText.length >= MIN_CHARS && inputText.length <= MAX_CHARS;
  const percent = (charCount / MAX_CHARS) * 100;

  const sampleTexts = [
    {
      label: 'Fake News Sample',
      text: "BREAKING: Scientists CONFIRM that 5G towers are secretly spreading a new virus to control the population! The government is hiding the TRUTH from you. Share this before they delete it! This is bigger than anyone thinks. Wake up people!",
    },
    {
      label: 'Real News Sample',
      text: "The Federal Reserve raised interest rates by 25 basis points on Wednesday, citing persistent inflation concerns. The decision was made unanimously by the Federal Open Market Committee and takes effect immediately. Economists predict this may slow consumer spending.",
    },
    {
      label: 'Science Article',
      text: "NASA's James Webb Space Telescope has captured unprecedented images of distant galaxies formed shortly after the Big Bang. The high-resolution observations reveal galaxy clusters that were previously invisible, offering new insights into the early universe's structure and evolution.",
    },
  ];

  return (
    <motion.div
      id="analyze-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 blur-xl"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className={`relative p-6 sm:p-8 rounded-2xl backdrop-blur-xl border ${
        darkMode
          ? 'bg-slate-900/60 border-white/10'
          : 'bg-white/70 border-slate-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Analyze News Article
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Paste or type any news article to detect authenticity
            </p>
          </div>
          <motion.div
            animate={{ rotate: isAnalyzing ? 360 : 0 }}
            transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: 'linear' }}
            className={`p-3 rounded-full ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}
          >
            <Sparkles className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </motion.div>
        </div>

        {/* Input Area */}
        <div className="relative mb-4">
          <motion.textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleChange}
            placeholder="Paste your news article here... (minimum 10 characters)"
            className={`w-full h-48 sm:h-56 p-4 rounded-xl resize-none transition-all focus:ring-2 focus:ring-offset-2 ${
              darkMode
                ? 'bg-slate-800/50 border-white/10 text-white placeholder-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-200'
            } border-2 focus:outline-none`}
            animate={showAnimation ? { scale: [1, 1.01, 1] } : {}}
            transition={{ duration: 0.3 }}
          />

          {/* Character Count Badge */}
          <motion.div
            className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
              percent > 90
                ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                : percent > 70
                ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                : darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
            }`}
            animate={{ scale: percent > 90 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {charCount} / {MAX_CHARS}
          </motion.div>

          {/* Processing Overlay */}
          <AnimatePresence>
            {showAnimation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className={`mt-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>
                    Analyzing...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className={`h-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full overflow-hidden mb-4`}>
          <motion.div
            className={`h-full rounded-full ${
              isValid
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : percent > 90
                ? 'bg-gradient-to-r from-red-400 to-rose-500'
                : 'bg-gradient-to-r from-blue-400 to-cyan-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>

        {/* Warnings */}
        <AnimatePresence>
          {charCount > 0 && charCount < MIN_CHARS && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`flex items-center gap-2 text-sm mb-4 ${
                darkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Add {MIN_CHARS - charCount} more characters to analyze</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <motion.button
            data-analyze-btn
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={!isValid || isAnalyzing}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              isValid && !isAnalyzing
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/25 hover:shadow-blue-500/40'
                : darkMode
                ? 'bg-slate-700 text-slate-400'
                : 'bg-slate-300 text-slate-500'
            }`}
          >
            <Send className="w-5 h-5" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePaste}
            className={`px-5 py-3.5 rounded-xl backdrop-blur-md border transition-all ${
              darkMode
                ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700'
            }`}
            title="Paste from clipboard"
          >
            <FileText className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`px-5 py-3.5 rounded-xl backdrop-blur-md border transition-all ${
              darkMode
                ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700'
            }`}
            title="Copy text"
          >
            <Copy className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSpeechToText}
            className={`px-5 py-3.5 rounded-xl backdrop-blur-md border transition-all ${
              isListening
                ? 'bg-red-500/20 border-red-500/30 text-red-400'
                : darkMode
                ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700'
            }`}
            title="Speech to text"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setInputText('');
              setCharCount(0);
              setPrediction(null);
            }}
            className={`px-5 py-3.5 rounded-xl backdrop-blur-md border transition-all ${
              darkMode
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
            title="Clear text"
          >
            Clear
          </motion.button>
        </div>

        {/* Sample Inputs */}
        <div className="mt-6 pt-6 border-t border-inherit">
          <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            Try these samples:
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((sample, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setInputText(sample.text);
                  setCharCount(sample.text.length);
                  toast.success(`Loaded ${sample.label}!`, { icon: '📝' });
                }}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  darkMode
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40'
                    : 'bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-600 border border-blue-200 hover:border-blue-300'
                }`}
              >
                {sample.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InputSection;
