/**
 * History Panel Component
 * Enhanced with animations and dark mode support
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trash2, Clock, Download, Share2 } from 'lucide-react';
import { usePredictionStore } from '../store/predictionStore';
import { toast } from 'sonner';

interface HistoryPanelProps {
  darkMode: boolean;
}

const HistoryPanel = ({ darkMode }: HistoryPanelProps) => {
  const { history, removeFromHistory, clearHistory } = usePredictionStore();

  const handleExportAll = async () => {
    if (history.length === 0) {
      toast.error('No history to export');
      return;
    }

    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fake-news-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('History exported!');
  };

  const handleShareHistory = async () => {
    if (history.length === 0) {
      toast.error('No history to share');
      return;
    }

    const summary = history
      .map((h, i) => `${i + 1}. ${h.label} (${h.confidence.toFixed(1)}%)`)
      .join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fake News Detection History',
          text: `Detection Results:\n${summary}`,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(summary);
      toast.success('History copied!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`sticky top-24 p-6 rounded-2xl backdrop-blur-xl border ${
        darkMode
          ? 'bg-slate-900/60 border-white/10'
          : 'bg-white/70 border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <Clock className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            History
          </h3>
          {history.length > 0 && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              darkMode ? 'bg-white/10 text-white/60' : 'bg-slate-200 text-slate-600'
            }`}>
              {history.length}
            </span>
          )}
        </div>

        {history.length > 0 && (
          <div className="flex gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleExportAll}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? 'hover:bg-white/10 text-white/60 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
              }`}
              title="Export history"
            >
              <Download className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShareHistory}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? 'hover:bg-white/10 text-white/60 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
              }`}
              title="Share history"
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearHistory}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? 'hover:bg-red-500/20 text-white/60 hover:text-red-400'
                  : 'hover:bg-red-50 text-slate-500 hover:text-red-600'
              }`}
              title="Clear history"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* History List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`py-12 text-center ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}
            >
              <div className="text-5xl mb-4">📋</div>
              <p className="font-medium">No predictions yet</p>
              <p className="text-sm mt-1">Analyze news to see history</p>
            </motion.div>
          ) : (
            history.map((pred, idx) => (
              <motion.div
                key={`${pred.label}-${pred.confidence}-${idx}`}
                layout
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className={`group p-4 rounded-xl border backdrop-blur-sm cursor-pointer transition-all ${
                  pred.label === 'FAKE'
                    ? darkMode
                      ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30'
                      : 'bg-red-50 border-red-100 hover:bg-red-100 hover:border-red-200'
                    : darkMode
                    ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/30'
                    : 'bg-green-50 border-green-100 hover:bg-green-100 hover:border-green-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {pred.label === 'FAKE' ? (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    )}
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold ${
                        pred.label === 'FAKE' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {pred.label}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        darkMode ? 'bg-white/10' : 'bg-slate-200'
                      }`}>
                        {pred.confidence.toFixed(0)}%
                      </span>
                    </div>
                    
                    {/* Mini Progress Bar */}
                    <div className={`h-1 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full mt-2 overflow-hidden`}>
                      <motion.div
                        className={`h-full ${pred.label === 'FAKE' ? 'bg-red-500' : 'bg-green-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pred.confidence}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                      />
                    </div>

                    <div className={`flex items-center justify-between mt-2 text-xs ${
                      darkMode ? 'text-gray-500' : 'text-slate-500'
                    }`}>
                      <span>Just now</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(idx);
                            toast.success('Removed from history');
                          }}
                          className={`p-1 rounded ${
                            darkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'
                          }`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Statistics Summary */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mt-6 pt-4 border-t ${darkMode ? 'border-white/10' : 'border-slate-200'}`}
        >
          <p className={`text-xs uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
            Summary
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Analyzed</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {history.length}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Avg Confidence</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {(history.reduce((acc, h) => acc + h.confidence, 0) / history.length).toFixed(0)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HistoryPanel;
