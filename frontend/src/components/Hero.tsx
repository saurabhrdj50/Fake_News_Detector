/**
 * Hero Section Component
 * Enhanced with typing animation, 3D effects, and more interactions
 */

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Shield, Zap, TrendingUp, ChevronDown, Play } from 'lucide-react';

interface HeroProps {
  darkMode: boolean;
}

const Hero = ({ darkMode }: HeroProps) => {
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = 'Detect Fake News';
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const y = useTransform(scrollY, [0, 300], [0, 100]);

  // Typing animation
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  // Blinking cursor
  useEffect(() => {
    if (!isTyping) {
      const timeout = setTimeout(() => setIsTyping(true), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isTyping]);

  const scrollToInput = () => {
    document.getElementById('analyze-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const features = [
    { icon: Shield, label: '95%+ Accuracy', color: 'text-green-400' },
    { icon: Zap, label: '<1s Response', color: 'text-yellow-400' },
    { icon: TrendingUp, label: 'Real-time', color: 'text-blue-400' },
  ];

  return (
    <motion.div style={{ opacity, y }} className="relative min-h-[70vh] flex items-center justify-center px-4 pt-16 pb-8">
      {/* 3D Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-32 h-32 rounded-full ${
              darkMode ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' : 'bg-gradient-to-br from-blue-300/20 to-purple-300/20'
            }`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-5xl relative z-10"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-md border ${
              darkMode
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30'
                : 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300'
            }`}
            animate={{
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 40px rgba(59, 130, 246, 0.5)',
                '0 0 20px rgba(59, 130, 246, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              AI-Powered Deep Learning
            </span>
          </motion.div>
        </motion.div>

        {/* Main Title with Typing Effect */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              {typedText}
            </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
              className="inline-block w-1 h-12 ml-2 bg-blue-400 rounded"
            />
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}
        >
          Advanced LSTM neural network with{' '}
          <motion.span
            className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Natural Language Processing
          </motion.span>{' '}
          analyzes any news article with remarkable precision.
        </motion.p>

        {/* Feature Pills */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md border ${
                darkMode
                  ? 'bg-white/5 border-white/10 hover:border-white/20'
                  : 'bg-white/60 border-white/40 hover:border-white/60'
              }`}
            >
              <feature.icon className={`w-5 h-5 ${feature.color}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>
                {feature.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={scrollToInput}
            className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Start Analyzing
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`px-10 py-4 font-semibold rounded-xl border backdrop-blur-md transition-all ${
              darkMode
                ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                : 'bg-white/60 hover:bg-white/80 border-white/40 text-slate-700'
            }`}
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { value: '50K+', label: 'Articles Tested', icon: '📰' },
            { value: '97.1%', label: 'Accuracy Rate', icon: '🎯' },
            { value: '<1s', label: 'Avg Response', icon: '⚡' },
            { value: '24/7', label: 'Always Online', icon: '🌐' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-4 md:p-6 rounded-2xl backdrop-blur-md border ${
                darkMode
                  ? 'bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-white/20'
                  : 'bg-gradient-to-br from-white/60 to-white/80 border-white/40 hover:border-white/60'
              }`}
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
              >
                {stat.value}
              </motion.div>
              <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`inline-flex flex-col items-center gap-2 cursor-pointer ${
              darkMode ? 'text-white/40' : 'text-slate-500'
            }`}
            onClick={scrollToInput}
          >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
