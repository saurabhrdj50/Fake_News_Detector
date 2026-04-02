/**
 * Main App Component
 * Enhanced with particles, animations, and keyboard shortcuts
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import InputSection from './components/InputSection';
import ResultCard from './components/ResultCard';
import HistoryPanel from './components/HistoryPanel';
import InfoSection from './components/InfoSection';
import { usePredictionStore } from './store/predictionStore';
import { Toaster } from 'sonner';
import { Keyboard, Moon, Sun, Volume2, VolumeX } from 'lucide-react';

function App() {
  const { prediction, isLoading, error, setLoading } = usePredictionStore();
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; duration: number; delay: number }>>([]);

  // Generate random particles on mount
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            document.querySelector<HTMLButtonElement>('[data-analyze-btn]')?.click();
            break;
          case 'k':
            e.preventDefault();
            setDarkMode((prev) => !prev);
            break;
        }
      }
      if (e.key === 'Escape') {
        usePredictionStore.getState().setPrediction(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-on-scroll');
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          element.classList.add('opacity-100');
          element.classList.remove('opacity-0');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Floating Orbs */}
        <motion.div
          className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl ${
            darkMode ? 'bg-blue-500/20' : 'bg-blue-300/30'
          }`}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl ${
            darkMode ? 'bg-purple-500/20' : 'bg-purple-300/30'
          }`}
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 60, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full blur-3xl ${
            darkMode ? 'bg-cyan-500/15' : 'bg-cyan-300/20'
          }`}
          animate={{
            x: [0, -60, 30, 0],
            y: [0, 40, -20, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating Particles */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              darkMode ? 'bg-white/20' : 'bg-slate-400/30'
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className={`absolute inset-0 opacity-5 ${
          darkMode ? '[background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]' : '[background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)]'
        }`}
        style={{ backgroundSize: '50px 50px' }}
        />
      </div>

      <Toaster 
        position="top-right" 
        theme={darkMode ? 'dark' : 'light'}
        toastOptions={{
          style: {
            background: darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            color: darkMode ? 'white' : 'black',
            backdropFilter: 'blur(10px)',
          },
        }}
      />

      {/* Control Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 right-0 z-50 flex items-center gap-2 p-4"
      >
        {/* Keyboard Shortcuts Hint */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
            darkMode ? 'bg-white/10 text-white/60' : 'bg-black/5 text-black/60'
          }`}
        >
          <Keyboard className="w-3 h-3" />
          <span>Ctrl+Enter to analyze</span>
        </motion.div>

        {/* Sound Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-full backdrop-blur-md transition-all ${
            darkMode 
              ? 'bg-white/10 hover:bg-white/20 text-white/60 hover:text-white' 
              : 'bg-black/5 hover:bg-black/10 text-black/60 hover:text-black'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>

        {/* Dark/Light Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: -15 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full backdrop-blur-md transition-all ${
            darkMode 
              ? 'bg-white/10 hover:bg-white/20 text-yellow-400' 
              : 'bg-black/5 hover:bg-black/10 text-slate-700'
          }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        {/* Hero Section */}
        <Hero darkMode={darkMode} />

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Input */}
            <div className="lg:col-span-2">
              <InputSection darkMode={darkMode} />

              {/* Result Card with Animations */}
              <AnimatePresence mode="wait">
                {prediction && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                    className="mt-8"
                  >
                    <ResultCard darkMode={darkMode} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error State */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-8 p-4 rounded-xl border ${
                      darkMode 
                        ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                        : 'bg-red-50 border-red-200 text-red-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - History */}
            <div>
              <HistoryPanel darkMode={darkMode} />
            </div>
          </div>

          {/* Info Sections */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20"
          >
            <InfoSection darkMode={darkMode} />
          </motion.div>
        </main>

        {/* Footer */}
        <footer className={`py-8 text-center ${darkMode ? 'text-white/40' : 'text-black/40'}`}>
          <p className="text-sm">
            Built with React, FastAPI, and TensorFlow
          </p>
          <p className="text-xs mt-2">
            Fake News Detector v2.0.0
          </p>
        </footer>
      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative">
              {/* Outer Ring */}
              <motion.div
                className="w-24 h-24 rounded-full border-4 border-transparent"
                style={{
                  borderTopColor: '#3b82f6',
                  borderRightColor: '#8b5cf6',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              {/* Middle Ring */}
              <motion.div
                className="absolute inset-2 w-20 h-20 rounded-full border-4 border-transparent"
                style={{
                  borderBottomColor: '#06b6d4',
                  borderLeftColor: '#10b981',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              {/* Inner Ring */}
              <motion.div
                className="absolute inset-4 w-16 h-16 rounded-full border-4 border-transparent"
                style={{
                  borderTopColor: '#f59e0b',
                  borderRightColor: '#ef4444',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-4 h-4 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </div>
            </div>
            <motion.p
              className={`mt-8 text-lg font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Analyzing...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
