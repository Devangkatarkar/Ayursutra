import React from 'react';
import { motion } from 'motion/react';

interface DhanviAvatarProps {
  size?: number;
  className?: string;
  isTyping?: boolean;
}

export function DhanviAvatar({ size = 32, className = "", isTyping = false }: DhanviAvatarProps) {
  const scale = size / 100; // Base size is 100

  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="overflow-visible"
        animate={isTyping ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.8, repeat: isTyping ? Infinity : 0 }}
      >
        {/* Background circle with gradient */}
        <defs>
          <radialGradient id="bg-gradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="100%" stopColor="#e879f9" />
          </radialGradient>
          <linearGradient id="hair-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id="skin-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient id="cheek-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="url(#bg-gradient)"
          stroke="#a855f7"
          strokeWidth="2"
        />

        {/* Hair back */}
        <motion.path
          d="M15 35 Q20 15, 50 18 Q80 15, 85 35 Q85 25, 50 20 Q15 25, 15 35 Z"
          fill="url(#hair-gradient)"
          animate={{
            d: [
              "M15 35 Q20 15, 50 18 Q80 15, 85 35 Q85 25, 50 20 Q15 25, 15 35 Z",
              "M14 36 Q19 14, 50 17 Q81 14, 86 36 Q86 24, 50 19 Q14 24, 14 36 Z",
              "M15 35 Q20 15, 50 18 Q80 15, 85 35 Q85 25, 50 20 Q15 25, 15 35 Z"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Face */}
        <circle
          cx="50"
          cy="55"
          r="25"
          fill="url(#skin-gradient)"
          stroke="#f59e0b"
          strokeWidth="1"
        />

        {/* Hair front */}
        <motion.path
          d="M25 40 Q30 30, 40 35 Q50 25, 60 35 Q70 30, 75 40"
          fill="none"
          stroke="url(#hair-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          animate={{
            d: [
              "M25 40 Q30 30, 40 35 Q50 25, 60 35 Q70 30, 75 40",
              "M24 41 Q29 29, 39 36 Q50 24, 61 36 Q71 29, 76 41",
              "M25 40 Q30 30, 40 35 Q50 25, 60 35 Q70 30, 75 40"
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Eyes */}
        <motion.g>
          {/* Left eye */}
          <ellipse cx="42" cy="50" rx="4" ry="5" fill="white" />
          <motion.circle
            cx="42"
            cy="51"
            r="2.5"
            fill="#1f2937"
            animate={isTyping ? {
              cy: [51, 49, 51],
              scaleY: [1, 0.3, 1]
            } : {
              cy: [51, 52, 51]
            }}
            transition={{ 
              duration: isTyping ? 0.6 : 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <circle cx="43" cy="49.5" r="0.8" fill="white" /> {/* Light reflection */}

          {/* Right eye */}
          <ellipse cx="58" cy="50" rx="4" ry="5" fill="white" />
          <motion.circle
            cx="58"
            cy="51"
            r="2.5"
            fill="#1f2937"
            animate={isTyping ? {
              cy: [51, 49, 51],
              scaleY: [1, 0.3, 1]
            } : {
              cy: [51, 52, 51]
            }}
            transition={{ 
              duration: isTyping ? 0.6 : 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.1 
            }}
          />
          <circle cx="59" cy="49.5" r="0.8" fill="white" />
        </motion.g>

        {/* Eyebrows */}
        <motion.path
          d="M38 44 Q42 42, 46 44"
          fill="none"
          stroke="#1f2937"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            d: [
              "M38 44 Q42 42, 46 44",
              "M38 43 Q42 41, 46 43",
              "M38 44 Q42 42, 46 44"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M54 44 Q58 42, 62 44"
          fill="none"
          stroke="#1f2937"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            d: [
              "M54 44 Q58 42, 62 44",
              "M54 43 Q58 41, 62 43",
              "M54 44 Q58 42, 62 44"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />

        {/* Nose */}
        <path
          d="M50 55 Q48 58, 50 60 Q52 58, 50 55"
          fill="#f59e0b"
          stroke="#f59e0b"
          strokeWidth="0.5"
        />

        {/* Mouth */}
        <motion.path
          d="M45 63 Q50 67, 55 63"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={isTyping ? {
            d: [
              "M45 63 Q50 67, 55 63",
              "M46 64 Q50 66, 54 64",
              "M45 63 Q50 67, 55 63"
            ]
          } : {
            d: [
              "M45 63 Q50 67, 55 63",
              "M45 64 Q50 68, 55 64",
              "M45 63 Q50 67, 55 63"
            ]
          }}
          transition={{ 
            duration: isTyping ? 0.4 : 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Cheeks */}
        <circle cx="35" cy="57" r="4" fill="url(#cheek-gradient)" />
        <circle cx="65" cy="57" r="4" fill="url(#cheek-gradient)" />

        {/* Decorative earrings */}
        <motion.g>
          <circle cx="28" cy="52" r="2" fill="#a855f7" />
          <motion.circle
            cx="28"
            cy="55"
            r="1.5"
            fill="#c084fc"
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <circle cx="72" cy="52" r="2" fill="#a855f7" />
          <motion.circle
            cx="72"
            cy="55"
            r="1.5"
            fill="#c084fc"
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
        </motion.g>

        {/* Hair ornament/flower */}
        <motion.g
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: '70px 35px' }}
        >
          <circle cx="70" cy="35" r="3" fill="#ec4899" />
          <circle cx="68" cy="33" r="1.5" fill="#f9a8d4" />
          <circle cx="72" cy="33" r="1.5" fill="#f9a8d4" />
          <circle cx="70" cy="37" r="1.5" fill="#f9a8d4" />
          <circle cx="70" cy="35" r="1" fill="#fbbf24" />
        </motion.g>

        {/* Thinking bubbles when typing */}
        {isTyping && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <circle cx="75" cy="25" r="1.5" fill="#a855f7" fillOpacity="0.6" />
            <motion.circle
              cx="80"
              cy="20"
              r="2"
              fill="#a855f7"
              fillOpacity="0.4"
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="85"
              cy="15"
              r="2.5"
              fill="#a855f7"
              fillOpacity="0.3"
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
            />
          </motion.g>
        )}

        {/* Sparkles around the avatar */}
        <motion.g>
          <motion.path
            d="M20 25 L22 27 L20 29 L18 27 Z"
            fill="#fbbf24"
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M85 70 L87 72 L85 74 L83 72 Z"
            fill="#ec4899"
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
              rotate: [0, -180, -360]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.circle
            cx="15"
            cy="70"
            r="1.5"
            fill="#a855f7"
            animate={{ 
              opacity: [0.4, 1, 0.4],
              scale: [0.6, 1.2, 0.6]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.g>
      </motion.svg>
    </div>
  );
}