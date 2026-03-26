/**
 * History Panel Component
 * Displays recent predictions
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { usePredictionStore } from '../store/predictionStore';

const HistoryPanel = () => {
  const { history, clearHistory } = usePredictionStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sticky top-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recent Predictions</h3>
        {history.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearHistory}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
            title="Clear history"
          >
            <Trash2 className="w-4 h-4 text-gray-400" />
          </motion.button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-gray-500"
            >
              <p>No predictions yet</p>
              <p className="text-sm">Analyze news to see history</p>
            </motion.div>
          ) : (
            history.map((pred, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border backdrop-blur-sm cursor-pointer transition-all ${
                  pred.label === 'FAKE'
                    ? 'bg-danger-500/10 border-danger-500/20 hover:bg-danger-500/20'
                    : 'bg-success-500/10 border-success-500/20 hover:bg-success-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  {pred.label === 'FAKE' ? (
                    <XCircle className="w-4 h-4 text-danger-400 flex-shrink-0 mt-1" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-success-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {pred.label === 'FAKE' ? 'Fake' : 'Real'} • {pred.confidence.toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                      Just now
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default HistoryPanel;
