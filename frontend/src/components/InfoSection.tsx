/**
 * Info Section Component
 * Educational content about the model
 */

import { motion } from 'framer-motion';
import { Brain, AlertTriangle, Zap, BookOpen } from 'lucide-react';

const InfoSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      className="space-y-8"
    >
      {/* How It Works */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-brand-500" />
          <h2 className="text-2xl font-bold text-white">How It Works</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: 1, title: 'Text Input', desc: 'Paste any news article' },
            { step: 2, title: 'Preprocessing', desc: 'Clean and tokenize text' },
            { step: 3, title: 'LSTM Analysis', desc: 'Deep learning model processes' },
            { step: 4, title: 'Result', desc: 'Get prediction & confidence' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold mb-3">
                {item.step}
              </div>
              <h4 className="font-semibold text-white mb-1">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Model Architecture */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-brand-500" />
          <h2 className="text-2xl font-bold text-white">Model Architecture</h2>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 rounded-lg">
          <div className="space-y-4 text-sm text-gray-300">
            <p>
              <span className="text-brand-400 font-semibold">LSTM Network</span> - Advanced recurrent neural network that captures sequence patterns and long-range dependencies in text.
            </p>
            <p>
              <span className="text-brand-400 font-semibold">Embedding Layer</span> - Converts words into 100-dimensional semantic vectors, placing similar words close in space.
            </p>
            <p>
              <span className="text-brand-400 font-semibold">Dropout Regularization</span> - Prevents overfitting by randomly deactivating neurons during training.
            </p>
            <p>
              <span className="text-brand-400 font-semibold">Sigmoid Output</span> - Produces probability scores between 0 (Fake) and 1 (Real).
            </p>
          </div>
        </div>
      </motion.section>

      {/* Limitations */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-brand-500" />
          <h2 className="text-2xl font-bold text-white">Limitations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'English-only: Model only supports English text',
            'Context limits: Sequences truncated/padded to 150 tokens',
            'Domain shift: May perform differently on new domains',
            'Satire confusion: Difficulty distinguishing satire from lies',
            'Adversarial text: Can be fooled by paraphrasing',
            'No source verification: Only analyzes text content',
          ].map((limitation, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
            >
              <p className="text-sm text-yellow-200">{limitation}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-brand-500" />
          <h2 className="text-2xl font-bold text-white">FAQ</h2>
        </div>

        <div className="space-y-3">
          {[
            { q: 'What accuracy can I expect?', a: '95%+ on the training dataset, though performance varies by domain.' },
            { q: 'How long does analysis take?', a: 'Typically less than 1 second per article.' },
            { q: 'Is my data stored?', a: 'No, all analysis is done in real-time and no data is persisted.' },
            { q: 'Can I use this for production?', a: 'Yes, but additional validation and domain-specific tuning is recommended.' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 5 }}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <h4 className="font-semibold text-white mb-2">{item.q}</h4>
              <p className="text-sm text-gray-400">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <motion.div
        variants={itemVariants}
        className="text-center py-8 border-t border-white/10"
      >
        <p className="text-gray-400">
          Built with React, Framer Motion, TensorFlow & FastAPI
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Version 2.0 • Production Ready
        </p>
      </motion.div>
    </motion.div>
  );
};

export default InfoSection;
