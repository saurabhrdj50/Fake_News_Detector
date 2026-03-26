/**
 * Main App Component
 * Complete React application with Framer Motion animations
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import InputSection from './components/InputSection';
import ResultCard from './components/ResultCard';
import HistoryPanel from './components/HistoryPanel';
import InfoSection from './components/InfoSection';
import { usePredictionStore } from './store/predictionStore';
import { Toaster } from 'sonner';

function App() {
  const { prediction, isLoading, error } = usePredictionStore();

  useEffect(() => {
    // Add scroll event for fade-in animations
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-on-scroll');
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          element.classList.add('opacity-100');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-blue-900 to-brand-900">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500 opacity-20 blur-3xl rounded-full"
          animate={{ x: [0, 100, -100, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"
          animate={{ x: [0, -100, 100, 0], y: [0, 50, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        {/* Hero Section */}
        <Hero />

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Input */}
            <div className="lg:col-span-2">
              <InputSection />

              {/* Result Card with Animations */}
              <AnimatePresence>
                {prediction && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="mt-8"
                  >
                    <ResultCard />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error State */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 p-4 bg-danger-500/10 border border-danger-500/50 rounded-lg text-danger-500"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column - History */}
            <div>
              <HistoryPanel />
            </div>
          </div>

          {/* Info Sections */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-20 fade-in-on-scroll opacity-0 transition-opacity duration-500"
          >
            <InfoSection />
          </motion.div>
        </main>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-16 h-16 border-4 border-brand-500/30 border-t-brand-500 rounded-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;
