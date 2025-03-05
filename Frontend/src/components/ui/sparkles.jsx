import React from 'react';
import { motion } from 'framer-motion';

export const FireworkSparkle = ({ color, size, style }) => {
  return (
    <motion.div
      style={{
        ...style,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{
        scale: [0, 1.5, 0],
        opacity: [1, 1, 0],
        y: [0, -100],
        x: [-50, 50],
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
    />
  );
};