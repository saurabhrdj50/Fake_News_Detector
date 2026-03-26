/**
 * Result Card Component
 * Displays prediction results with animated visualizations
 */

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { usePredictionStore } from '../store/predictionStore';

const ResultCard = () => {
  const { prediction } = usePredictionStore();

  if (!prediction) return null;

  const isFake = prediction.label === 'FAKE';
  const icon = isFake ? XCircle : CheckCircle;
  const Icon = icon;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`p-8 rounded-2xl border backdrop-blur-xl transition-all ${
        isFake
          ? 'bg-danger-500/10 border-danger-500/30 shadow-lg shadow-danger-500/20'
          : 'bg-success-500/10 border-success-500/30 shadow-lg shadow-success-500/20'
      }`}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon className={`w-12 h-12 ${isFake ? 'text-danger-500' : 'text-success-500'}`} />
        </motion.div>
        <div>
          <p className="text-sm text-gray-400">Prediction Result</p>
          <h3 className={`text-4xl font-bold ${isFake ? 'text-danger-400' : 'text-success-400'}`}>
            {prediction.label}
          </h3>
        </div>
      </motion.div>

      {/* Confidence Score */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-300 font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Confidence Score
          </p>
          <p className="text-3xl font-bold text-brand-400">{prediction.confidence.toFixed(1)}%</p>
        </div>

        {/* Animated Progress Bar */}
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-400"
            initial={{ width: 0 }}
            animate={{ width: `${prediction.confidence}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Probability Breakdown */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
        {/* Fake Probability */}
        <div className="p-4 bg-white/5 rounded-lg border border-danger-500/20">
          <p className="text-sm text-gray-400 mb-2">Fake Probability</p>
          <motion.p
            className="text-2xl font-bold text-danger-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {prediction.prob_fake.toFixed(1)}%
          </motion.p>
          <div className="h-1 bg-danger-500/20 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-danger-500"
              initial={{ width: 0 }}
              animate={{ width: `${prediction.prob_fake}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Real Probability */}
        <div className="p-4 bg-white/5 rounded-lg border border-success-500/20">
          <p className="text-sm text-gray-400 mb-2">Real Probability</p>
          <motion.p
            className="text-2xl font-bold text-success-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {prediction.prob_real.toFixed(1)}%
          </motion.p>
          <div className="h-1 bg-success-500/20 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-success-500"
              initial={{ width: 0 }}
              animate={{ width: `${prediction.prob_real}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Details */}
      <motion.div variants={itemVariants} className="space-y-2 text-sm text-gray-400">
        <p>Original length: <span className="text-white">{prediction.original_length} characters</span></p>
        <p>Cleaned tokens: <span className="text-white">{prediction.cleaned_length} characters</span></p>
        <p>Processing time: <span className="text-white">&lt;1 second</span></p>
      </motion.div>

      {/* Action Button */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/20"
      >
        Save Result
      </motion.button>
    </motion.div>
  );
};

export default ResultCard;
