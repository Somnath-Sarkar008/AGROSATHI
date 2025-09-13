import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const InteractiveCard = ({ 
  children, 
  className = '', 
  onClick, 
  hoverEffect = true,
  mandalaPattern = true,
  delay = 0 
}) => {
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: delay
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      rotateY: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const mandalaVariants = {
    hidden: { opacity: 0, scale: 0, rotate: 0 },
    visible: { 
      opacity: 0.1, 
      scale: 1, 
      rotate: 360,
      transition: {
        duration: 2,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: isHovered ? 0.3 : 0.1, 
      scale: isHovered ? 1.2 : 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`relative group cursor-pointer ${className}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={hoverEffect ? "hover" : undefined}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={onClick}
        >
          {/* Mandala background pattern */}
          {mandalaPattern && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              variants={mandalaVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 opacity-20">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <radialGradient id="mandalaGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={isDark ? '#ec4899' : '#f472b6'} />
                        <stop offset="50%" stopColor={isDark ? '#06b6d4' : '#22d3ee'} />
                        <stop offset="100%" stopColor={isDark ? '#8b5cf6' : '#a78bfa'} />
                      </radialGradient>
                    </defs>
                    <g transform="rotate(0 50 50)">
                      {[...Array(12)].map((_, i) => (
                        <g key={i} transform={`rotate(${i * 30} 50 50)`}>
                          <path
                            d="M50 20 Q60 35 70 50 Q60 65 50 80 Q40 65 30 50 Q40 35 50 20"
                            fill="url(#mandalaGradient)"
                            opacity="0.6"
                          />
                          <circle cx="50" cy="35" r="2" fill={isDark ? '#ffffff' : '#000000'} opacity="0.8" />
                        </g>
                      ))}
                      <circle cx="50" cy="50" r="8" fill="url(#mandalaGradient)" />
                    </g>
                  </svg>
                </div>
              </div>
            </motion.div>
          )}

          {/* Glow effect */}
          <motion.div
            className={`absolute inset-0 rounded-xl ${
              isDark 
                ? 'bg-gradient-to-r from-pink-500/20 via-cyan-500/20 to-purple-500/20' 
                : 'bg-gradient-to-r from-pink-300/20 via-cyan-300/20 to-purple-300/20'
            } blur-xl`}
            variants={glowVariants}
            initial="hidden"
            animate="visible"
          />

          {/* Main content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Interactive border */}
          <motion.div
            className={`absolute inset-0 rounded-xl border-2 ${
              isDark 
                ? 'border-pink-500/30' 
                : 'border-pink-400/30'
            }`}
            animate={{
              boxShadow: isHovered 
                ? isDark
                  ? '0 0 30px rgba(236, 72, 153, 0.4), 0 0 60px rgba(6, 182, 212, 0.2)'
                  : '0 0 30px rgba(244, 114, 182, 0.4), 0 0 60px rgba(34, 211, 238, 0.2)'
                : '0 0 0px rgba(0, 0, 0, 0)'
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Floating particles on hover */}
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full ${
                      isDark ? 'bg-pink-400' : 'bg-pink-500'
                    }`}
                    initial={{ 
                      opacity: 0, 
                      scale: 0,
                      x: '50%',
                      y: '50%'
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: `${50 + (Math.cos(i * 60 * Math.PI / 180) * 100)}%`,
                      y: `${50 + (Math.sin(i * 60 * Math.PI / 180) * 100)}%`
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InteractiveCard;
