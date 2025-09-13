import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const dotVariants = {
    animate: (i) => ({
      y: [0, -20, 0],
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.2
      }
    })
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Main mandala spinner */}
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size]} relative`}
          variants={spinnerVariants}
          animate="animate"
        >
          {/* Outer ring */}
          <div className={`absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-mandala-pink-500 via-mandala-cyan-500 to-mandala-purple-500 bg-clip-border animate-spin`} />
          
          {/* Inner rotating mandala */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-mandala-pink-100 via-mandala-cyan-100 to-mandala-purple-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 flex items-center justify-center">
            <motion.div
              className="w-1/2 h-1/2"
              variants={spinnerVariants}
              animate="animate"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <radialGradient id="spinnerGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={isDark ? '#ec4899' : '#f472b6'} />
                    <stop offset="50%" stopColor={isDark ? '#06b6d4' : '#22d3ee'} />
                    <stop offset="100%" stopColor={isDark ? '#8b5cf6' : '#a78bfa'} />
                  </radialGradient>
                </defs>
                <g>
                  {[...Array(8)].map((_, i) => (
                    <g key={i} transform={`rotate(${i * 45} 50 50)`}>
                      <path
                        d="M50 20 Q60 30 70 50 Q60 70 50 80 Q40 70 30 50 Q40 30 50 20"
                        fill="url(#spinnerGradient)"
                        opacity="0.8"
                      />
                    </g>
                  ))}
                  <circle cx="50" cy="50" r="15" fill="url(#spinnerGradient)" />
                </g>
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              isDark ? 'bg-cyan-400' : 'bg-pink-400'
            }`}
            style={{
              left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
              top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 60}%`
            }}
            custom={i}
            variants={dotVariants}
            animate="animate"
          />
        ))}
      </div>

      {/* Loading text */}
      {text && (
        <motion.div
          className={`${textSizes[size]} font-medium transition-colors duration-300 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}
          variants={pulseVariants}
          animate="animate"
        >
          {text}
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="w-32 h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-mandala-pink-500 via-mandala-cyan-500 to-mandala-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
