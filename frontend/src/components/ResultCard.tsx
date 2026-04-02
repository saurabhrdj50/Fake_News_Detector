/**
 * Result Card Component
 * Enhanced with animated visualizations, share, export, and Gemini AI analysis
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, TrendingUp, Share2, Download, RefreshCw, Copy, Sparkles, AlertTriangle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { usePredictionStore } from '../store/predictionStore';
import { useState } from 'react';
import { toast } from 'sonner';

interface ResultCardProps {
  darkMode: boolean;
}

const ResultCard = ({ darkMode }: ResultCardProps) => {
  const { prediction, setPrediction, setInputText } = usePredictionStore();
  const [showDetails, setShowDetails] = useState(false);
  const [showGeminiAnalysis, setShowGeminiAnalysis] = useState(true);

  if (!prediction) return null;

  const isFake = prediction.label === 'FAKE';
  const icon = isFake ? XCircle : CheckCircle;
  const Icon = icon;
  const gemini = prediction.gemini_analysis;

  const handleShare = async () => {
    const geminiText = gemini ? `\n\nGemini AI Verdict: ${gemini.verdict}` : '';
    const text = `Fake News Detection Result:\n${prediction.label} (${prediction.confidence.toFixed(1)}% confidence)${geminiText}\n\nAnalyzed by Fake News Detector AI`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fake News Detection Result',
          text: text,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Result copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const result = {
      label: prediction.label,
      confidence: prediction.confidence,
      prob_fake: prediction.prob_fake,
      prob_real: prediction.prob_real,
      original_length: prediction.original_length,
      cleaned_length: prediction.cleaned_length,
      gemini_analysis: gemini,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fake-news-result-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Result downloaded!');
  };

  const handleRetry = () => {
    setPrediction(null);
    setInputText('');
  };

  const handleCopy = async () => {
    let text = `${prediction.label} News Detected!\nConfidence: ${prediction.confidence.toFixed(1)}%\nFake Probability: ${prediction.prob_fake.toFixed(1)}%\nReal Probability: ${prediction.prob_real.toFixed(1)}%`;
    if (gemini) {
      text += `\n\nGemini AI Analysis:\n${gemini.explanation}`;
    }
    await navigator.clipboard.writeText(text);
    toast.success('Result copied!');
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden"
    >
      {/* Glow Effect */}
      <motion.div
        className={`absolute -inset-1 rounded-3xl ${
          isFake
            ? 'bg-gradient-to-r from-red-500 via-pink-500 to-red-500'
            : 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-500'
        }`}
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ filter: 'blur(20px)' }}
      />

      <div className={`relative p-8 rounded-2xl backdrop-blur-xl border ${
        isFake
          ? darkMode
            ? 'bg-red-950/60 border-red-500/30'
            : 'bg-red-50/80 border-red-200'
          : darkMode
          ? 'bg-green-950/60 border-green-500/30'
          : 'bg-green-50/80 border-green-200'
      }`}>
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: isFake ? [-5, 5, -5] : [0, 0, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`p-3 rounded-2xl ${
                isFake
                  ? 'bg-red-500/20'
                  : 'bg-green-500/20'
              }`}
            >
              <Icon className={`w-10 h-10 ${isFake ? 'text-red-400' : 'text-green-400'}`} />
            </motion.div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Detection Result
              </p>
              <motion.h3
                className={`text-4xl font-bold ${
                  isFake ? 'text-red-400' : 'text-green-400'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                {prediction.label}
              </motion.h3>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className={`p-2 rounded-lg backdrop-blur-md ${
                darkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white/70'
                  : 'bg-white/80 hover:bg-white text-slate-600'
              }`}
              title="Copy result"
            >
              <Copy className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className={`p-2 rounded-lg backdrop-blur-md ${
                darkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white/70'
                  : 'bg-white/80 hover:bg-white text-slate-600'
              }`}
              title="Share result"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className={`p-2 rounded-lg backdrop-blur-md ${
                darkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white/70'
                  : 'bg-white/80 hover:bg-white text-slate-600'
              }`}
              title="Download result"
            >
              <Download className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRetry}
              className={`p-2 rounded-lg backdrop-blur-md ${
                darkMode
                  ? 'bg-white/10 hover:bg-white/20 text-white/70'
                  : 'bg-white/80 hover:bg-white text-slate-600'
              }`}
              title="New analysis"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Confidence Score */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className={`flex items-center gap-2 font-semibold ${
              darkMode ? 'text-white' : 'text-slate-800'
            }`}>
              <TrendingUp className="w-5 h-5" />
              LSTM Model Confidence
            </p>
            <motion.p
              className={`text-4xl font-bold ${
                isFake ? 'text-red-400' : 'text-green-400'
              }`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {prediction.confidence.toFixed(1)}%
            </motion.p>
          </div>

          {/* Animated Progress Bar */}
          <div className={`h-4 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full overflow-hidden`}>
            <motion.div
              className={`h-full rounded-full ${
                isFake
                  ? 'bg-gradient-to-r from-red-500 to-pink-500'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${prediction.confidence}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Probability Breakdown */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-6">
          {/* Fake Probability */}
          <motion.div
            className={`p-5 rounded-xl ${
              isFake
                ? 'bg-red-500/10 border border-red-500/30'
                : 'bg-slate-500/10 border border-slate-500/20'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Fake Probability
              </p>
              <XCircle className={`w-5 h-5 ${isFake ? 'text-red-400' : 'text-slate-400'}`} />
            </div>
            <motion.p
              className={`text-3xl font-bold ${isFake ? 'text-red-400' : 'text-slate-500'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {prediction.prob_fake.toFixed(1)}%
            </motion.p>
            <div className={`h-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full mt-3 overflow-hidden`}>
              <motion.div
                className="h-full bg-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${prediction.prob_fake}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Real Probability */}
          <motion.div
            className={`p-5 rounded-xl ${
              !isFake
                ? 'bg-green-500/10 border border-green-500/30'
                : 'bg-slate-500/10 border border-slate-500/20'
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Real Probability
              </p>
              <CheckCircle className={`w-5 h-5 ${!isFake ? 'text-green-400' : 'text-slate-400'}`} />
            </div>
            <motion.p
              className={`text-3xl font-bold ${!isFake ? 'text-green-400' : 'text-slate-500'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {prediction.prob_real.toFixed(1)}%
            </motion.p>
            <div className={`h-2 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-full mt-3 overflow-hidden`}>
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${prediction.prob_real}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Gemini AI Analysis Section */}
        <AnimatePresence>
          {gemini && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className={`p-5 rounded-xl border ${
                darkMode ? 'bg-purple-950/40 border-purple-500/30' : 'bg-purple-50 border-purple-200'
              }`}>
                {/* Gemini Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`p-2 rounded-lg ${
                        darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                      }`}
                    >
                      <Sparkles className={`w-5 h-5 ${
                        darkMode ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                    </motion.div>
                    <div>
                      <p className={`font-semibold ${
                        darkMode ? 'text-purple-300' : 'text-purple-700'
                      }`}>
                        Gemini AI Analysis
                      </p>
                      <p className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        {gemini.confidence.toFixed(0)}% confidence
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowGeminiAnalysis(!showGeminiAnalysis)}
                    className={`p-1 rounded ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
                    }`}
                  >
                    {showGeminiAnalysis ? (
                      <ChevronUp className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`} />
                    )}
                  </motion.button>
                </div>

                {/* Verdict */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-4 ${
                  gemini.is_fake
                    ? darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                    : darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                }`}>
                  {gemini.is_fake ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  <span className="font-medium">{gemini.verdict}</span>
                </div>

                <AnimatePresence>
                  {showGeminiAnalysis && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Explanation */}
                      <div>
                        <p className={`text-sm font-medium mb-1 ${
                          darkMode ? 'text-gray-300' : 'text-slate-700'
                        }`}>
                          Analysis
                        </p>
                        <p className={`text-sm leading-relaxed ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {gemini.explanation}
                        </p>
                      </div>

                      {/* Red Flags */}
                      {gemini.red_flags && gemini.red_flags.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <p className={`text-sm font-medium ${
                              darkMode ? 'text-red-300' : 'text-red-600'
                            }`}>
                              Red Flags Detected
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {gemini.red_flags.map((flag, i) => (
                              <span
                                key={i}
                                className={`px-2 py-1 rounded text-xs ${
                                  darkMode
                                    ? 'bg-red-500/20 text-red-300'
                                    : 'bg-red-50 text-red-600'
                                }`}
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Supporting Evidence */}
                      {gemini.supporting_evidence && gemini.supporting_evidence.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <p className={`text-sm font-medium ${
                              darkMode ? 'text-green-300' : 'text-green-600'
                            }`}>
                              Credible Elements
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {gemini.supporting_evidence.map((evidence, i) => (
                              <span
                                key={i}
                                className={`px-2 py-1 rounded text-xs ${
                                  darkMode
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-green-50 text-green-600'
                                }`}
                              >
                                {evidence}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Gemini Available Message */}
        {!gemini && prediction.gemini_available === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-6 p-4 rounded-lg text-center ${
              darkMode ? 'bg-slate-800/50 text-gray-400' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Sparkles className="w-5 h-5 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Add GEMINI_API_KEY for enhanced AI-powered analysis
            </p>
          </motion.div>
        )}

        {/* Verdict Message */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <motion.div
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
              isFake
                ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                : 'bg-green-500/10 text-green-400 border border-green-500/30'
            }`}
            animate={{
              boxShadow: isFake
                ? ['0 0 20px rgba(239, 68, 68, 0.3)', '0 0 40px rgba(239, 68, 68, 0.5)', '0 0 20px rgba(239, 68, 68, 0.3)']
                : ['0 0 20px rgba(34, 197, 94, 0.3)', '0 0 40px rgba(34, 197, 94, 0.5)', '0 0 20px rgba(34, 197, 94, 0.3)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isFake ? (
              <>
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">This article shows signs of misinformation</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">This article appears to be credible</span>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Details Toggle */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowDetails(!showDetails)}
          className={`w-full py-2 text-sm ${
            darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </motion.button>

        {/* Additional Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className={`pt-4 mt-4 border-t ${darkMode ? 'border-white/10' : 'border-slate-200'} space-y-2 text-sm ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                <div className="flex justify-between">
                  <span>Original text length:</span>
                  <span className={darkMode ? 'text-white' : 'text-slate-800'}>
                    {prediction.original_length} characters
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Processed tokens:</span>
                  <span className={darkMode ? 'text-white' : 'text-slate-800'}>
                    {prediction.cleaned_length} characters
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Analysis models:</span>
                  <span className={darkMode ? 'text-white' : 'text-slate-800'}>
                    LSTM + {gemini ? 'Gemini AI' : 'Gemini (unavailable)'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ResultCard;
