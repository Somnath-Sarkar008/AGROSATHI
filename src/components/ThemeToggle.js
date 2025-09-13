import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  const toggleVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const iconVariants = {
    initial: { opacity: 0, scale: 0, rotate: -90 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0, 
      rotate: 90,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0, y: 0 },
    animate: { 
      opacity: [0, 1, 0], 
      scale: [0, 1, 0], 
      y: [-10, 0, 10],
      transition: { 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.button
      className={`relative p-3 rounded-full transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-cyan-400 hover:from-slate-700 hover:to-slate-800'
          : 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 hover:from-amber-200 hover:to-amber-300'
      } shadow-lg hover:shadow-xl border ${
        isDark ? 'border-slate-600' : 'border-amber-300'
      }`}
      variants={toggleVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={toggleTheme}
    >
      {/* Background mandala pattern */}
      <div className="absolute inset-0 rounded-full overflow-hidden opacity-20">
        <div className="w-full h-full flex items-center justify-center">
          <motion.div
            className="w-16 h-16"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="toggleGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={isDark ? '#06b6d4' : '#f59e0b'} />
                  <stop offset="50%" stopColor={isDark ? '#8b5cf6' : '#f97316'} />
                  <stop offset="100%" stopColor={isDark ? '#ec4899' : '#dc2626'} />
                </radialGradient>
              </defs>
              <g>
                {[...Array(8)].map((_, i) => (
                  <g key={i} transform={`rotate(${i * 45} 50 50)`}>
                    <path
                      d="M50 20 Q60 30 70 50 Q60 70 50 80 Q40 70 30 50 Q40 30 50 20"
                      fill="url(#toggleGradient)"
                    />
                  </g>
                ))}
                <circle cx="50" cy="50" r="12" fill="url(#toggleGradient)" />
              </g>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Icon */}
      <motion.div
        className="relative z-10"
        key={isDark ? 'moon' : 'sun'}
        variants={iconVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {isDark ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-cyan-400' : 'bg-amber-500'
            }`}
            style={{
              left: `${20 + (i * 20)}%`,
              top: `${20 + (i % 2 * 20)}%`
            }}
            variants={sparkleVariants}
            initial="initial"
            animate="animate"
            custom={i}
          />
        ))}
      </div>

      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20' 
            : 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20'
        } blur-lg`}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
