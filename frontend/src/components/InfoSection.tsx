/**
 * Info Section Component
 * Enhanced with dark mode and animations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertTriangle, Zap, BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface InfoSectionProps {
  darkMode: boolean;
}

const InfoSection = ({ darkMode }: InfoSectionProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const steps = [
    { step: 1, title: 'Text Input', desc: 'Paste any news article', icon: '📝' },
    { step: 2, title: 'Preprocessing', desc: 'Clean and tokenize text', icon: '🔄' },
    { step: 3, title: 'LSTM Analysis', desc: 'Deep learning processes', icon: '🧠' },
    { step: 4, title: 'Result', desc: 'Get prediction & confidence', icon: '✅' },
  ];

  const limitations = [
    { text: 'English-only: Model only supports English text', severity: 'high' },
    { text: 'Context limits: Sequences truncated to 150 tokens', severity: 'medium' },
    { text: 'Domain shift: May vary on new topics', severity: 'medium' },
    { text: 'Satire confusion: Difficulty with satire', severity: 'low' },
    { text: 'Adversarial text: Can be fooled by paraphrasing', severity: 'high' },
    { text: 'No source verification: Only analyzes text', severity: 'low' },
  ];

  const faqs = [
    { q: 'What accuracy can I expect?', a: '97%+ on the training dataset, though performance varies by domain and content type.' },
    { q: 'How long does analysis take?', a: 'Typically less than 1 second per article due to optimized model architecture.' },
    { q: 'Is my data stored?', a: 'No, all analysis is done in real-time and no data is persisted on our servers.' },
    { q: 'Can I use this commercially?', a: 'Yes, but additional validation and domain-specific tuning is recommended for production use.' },
    { q: 'What types of fake news does it detect?', a: 'It detects misleading articles, hoaxes, propaganda, and misinformation based on writing patterns.' },
    { q: 'How does the confidence score work?', a: 'The model outputs a probability between 0-100%. Higher confidence means the model is more certain about its prediction.' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-12"
    >
      {/* How It Works */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            className={`p-3 rounded-xl ${
              darkMode ? 'bg-blue-500/20' : 'bg-blue-100'
            }`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Brain className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </motion.div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            How It Works
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-2xl border backdrop-blur-xl overflow-hidden ${
                darkMode
                  ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10 hover:border-blue-500/30'
                  : 'bg-white/70 border-slate-200 hover:border-blue-400 shadow-lg'
              }`}
            >
              {/* Glow Effect */}
              <motion.div
                className={`absolute -top-10 -right-10 w-20 h-20 rounded-full blur-xl ${
                  darkMode ? 'bg-blue-500/20' : 'bg-blue-300/30'
                }`}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="relative z-10">
                <motion.div
                  className={`text-4xl mb-3`}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                >
                  {item.icon}
                </motion.div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold mb-4 ${
                  darkMode
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.step}
                </div>
                <h4 className={`font-bold text-lg mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.title}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  {item.desc}
                </p>
              </div>

              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className={`hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 ${
                  darkMode ? 'bg-white/20' : 'bg-slate-300'
                }`} />
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Model Architecture */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            className={`p-3 rounded-xl ${
              darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </motion.div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Model Architecture
          </h2>
        </div>

        <div className={`relative p-8 rounded-2xl backdrop-blur-xl border overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10'
            : 'bg-white/70 border-slate-200 shadow-xl'
        }`}>
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-64 h-64 rounded-full ${
                  darkMode ? 'bg-purple-500/5' : 'bg-purple-100/50'
                }`}
                style={{ left: `${20 + i * 30}%`, top: `${10 + i * 20}%` }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-6 text-sm">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
              <h4 className={`font-bold text-base mb-2 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                LSTM Network
              </h4>
              <p className={darkMode ? 'text-gray-300' : 'text-slate-600'}>
                Long Short-Term Memory networks capture sequence patterns and long-range dependencies in text data, making them ideal for NLP tasks.
              </p>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
              <h4 className={`font-bold text-base mb-2 ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                Embedding Layer
              </h4>
              <p className={darkMode ? 'text-gray-300' : 'text-slate-600'}>
                Converts words into 100-dimensional vectors, placing semantically similar words close together in vector space.
              </p>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
              <h4 className={`font-bold text-base mb-2 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                Dropout Regularization
              </h4>
              <p className={darkMode ? 'text-gray-300' : 'text-slate-600'}>
                Prevents overfitting by randomly deactivating neurons during training, improving generalization.
              </p>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
              <h4 className={`font-bold text-base mb-2 ${
                darkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>
                Sigmoid Output
              </h4>
              <p className={darkMode ? 'text-gray-300' : 'text-slate-600'}>
                Produces probability scores between 0 (Fake) and 1 (Real) for binary classification.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Limitations */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            className={`p-3 rounded-xl ${
              darkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'
            }`}
            animate={{ x: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AlertTriangle className={`w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          </motion.div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Limitations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {limitations.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -3 }}
              className={`p-5 rounded-xl border backdrop-blur-sm ${
                item.severity === 'high'
                  ? darkMode
                    ? 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
                    : 'bg-red-50 border-red-200 hover:border-red-300'
                  : item.severity === 'medium'
                  ? darkMode
                    ? 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50'
                    : 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
                  : darkMode
                  ? 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50'
                  : 'bg-blue-50 border-blue-200 hover:border-blue-300'
              }`}
            >
              <p className={`text-sm ${
                item.severity === 'high'
                  ? darkMode ? 'text-red-300' : 'text-red-700'
                  : item.severity === 'medium'
                  ? darkMode ? 'text-yellow-300' : 'text-yellow-700'
                  : darkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            className={`p-3 rounded-xl ${
              darkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'
            }`}
            whileHover={{ scale: 1.1 }}
          >
            <BookOpen className={`w-6 h-6 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
          </motion.div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            FAQ
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-xl border overflow-hidden backdrop-blur-xl ${
                darkMode
                  ? 'bg-slate-800/50 border-white/10'
                  : 'bg-white/70 border-slate-200 shadow-lg'
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className={`font-semibold pr-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {item.q}
                </span>
                <motion.div
                  animate={{ rotate: openFaq === idx ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {openFaq === idx ? (
                    <ChevronUp className={`w-5 h-5 flex-shrink-0 ${
                      darkMode ? 'text-gray-400' : 'text-slate-500'
                    }`} />
                  ) : (
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 ${
                      darkMode ? 'text-gray-400' : 'text-slate-500'
                    }`} />
                  )}
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-5 pb-5 ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Resources */}
      <motion.section variants={itemVariants}>
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Learn More
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'TensorFlow LSTM', url: 'https://www.tensorflow.org/guide/keras/rnn', emoji: '📚' },
            { title: 'NLP Best Practices', url: 'https://developers.google.com/machine-learning/guides/text-classification', emoji: '💡' },
            { title: 'Fake News Detection', url: 'https://en.wikipedia.org/wiki/Fake_news', emoji: '🔍' },
          ].map((resource, idx) => (
            <motion.a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`flex items-center gap-4 p-5 rounded-xl border backdrop-blur-xl ${
                darkMode
                  ? 'bg-slate-800/50 border-white/10 hover:border-blue-500/30'
                  : 'bg-white/70 border-slate-200 hover:border-blue-400 shadow-lg'
              }`}
            >
              <span className="text-3xl">{resource.emoji}</span>
              <div className="flex-1">
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {resource.title}
                </span>
              </div>
              <ExternalLink className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`} />
            </motion.a>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default InfoSection;
