import React from 'react';
import { motion } from 'motion/react';

interface MandalaLogoProps {
  size?: number;
  className?: string;
}

export function MandalaLogo({ size = 32, className = "" }: MandalaLogoProps) {
  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {/* Outer rotating circle */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer mandala circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="2"
          strokeDasharray="5,3"
        />
        
        {/* Outer petals */}
        {[...Array(8)].map((_, i) => (
          <motion.path
            key={i}
            d={`M50,10 Q60,20 50,30 Q40,20 50,10`}
            fill="url(#gradient2)"
            stroke="#22c55e"
            strokeWidth="0.5"
            transform={`rotate(${i * 45} 50 50)`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Inner rotating elements */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {/* Inner circle */}
        <circle
          cx="50"
          cy="50"
          r="25"
          fill="none"
          stroke="url(#gradient3)"
          strokeWidth="1.5"
        />
        
        {/* Inner petals */}
        {[...Array(6)].map((_, i) => (
          <motion.path
            key={i}
            d={`M50,30 Q55,35 50,40 Q45,35 50,30`}
            fill="url(#gradient4)"
            stroke="#16a34a"
            strokeWidth="0.3"
            transform={`rotate(${i * 60} 50 50)`}
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
        
        <defs>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Central core with karma arrows */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        {/* Central circle */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="url(#centralGradient)"
          stroke="#15803d"
          strokeWidth="1"
        />
        
        {/* Karma arrows - representing actions and therapies */}
        {[...Array(4)].map((_, i) => (
          <motion.g key={i} transform={`rotate(${i * 90} 50 50)`}>
            <motion.path
              d="M50,38 L48,42 L50,40 L52,42 Z"
              fill="#15803d"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
            />
            <motion.line
              x1="50"
              y1="40"
              x2="50"
              y2="35"
              stroke="#15803d"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
            />
          </motion.g>
        ))}
        
        <defs>
          <radialGradient id="centralGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="70%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>
        </defs>
      </motion.svg>

      {/* Subtle outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          filter: 'blur(2px)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
}