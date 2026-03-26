/**
 * Hero Section Component
 * Landing section with animated introduction
 */

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="relative min-h-[50vh] flex items-center justify-center px-4 pt-20 pb-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-4xl"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 border border-brand-500/30 rounded-full">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium text-brand-300">AI-Powered Detection</span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Detect Fake News{' '}
          <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
            Instantly
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Powered by advanced Deep Learning (LSTM) and Natural Language Processing. Analyze any news article with 95%+ accuracy.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Start Analyzing
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm border border-white/20 transition-all"
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto"
        >
          {[
            { label: '10K+', sublabel: 'Articles Analyzed' },
            { label: '95%', sublabel: 'Accuracy Rate' },
            { label: '<1s', sublabel: 'Response Time' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg"
            >
              <div className="text-2xl font-bold text-brand-400">{stat.label}</div>
              <div className="text-sm text-gray-400">{stat.sublabel}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
