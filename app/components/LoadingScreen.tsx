'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onLoadingComplete();
      }, 500); // Wait for fade out animation
    }, 1500); // Adjust loading time as needed

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[99999] bg-[#f5f5f0] flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <motion.div
            className="w-20 h-20 border-4 border-black bg-[#ffda03] mx-auto relative"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <motion.div
              className="absolute inset-0 border-4 border-transparent border-t-black"
              animate={{
                rotate: [0, -360],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="text-2xl font-black text-black uppercase tracking-wider"
        >
          MOHIT JANGID
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          className="text-sm text-gray-600 mt-2 uppercase tracking-widest"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
}

