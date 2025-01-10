import React from 'react';
import { motion } from 'framer-motion';
import { Code, GraduationCap, Briefcase } from 'lucide-react';
import HeroContent from './HeroContent';

export default function Hero() {
  const icons = [
    <Code size="100%" />,
    <GraduationCap size="100%" />,
    <Briefcase size="100%" />
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-purple-50 to-white" />
      
      {/* Floating animated icons */}
      <motion.div
        animate={{ 
          y: [0, -50, 20, -30, 0],
          x: [0, 30, -20, 40, 0],
          rotate: [0, 10, -8, 12, 0]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute right-[25%] top-[15%]"
      >
        <div className="h-28 w-28 text-indigo-600/20">
          {React.cloneElement(icons[0] as React.ReactElement, { size: "100%" })}
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 40, -30, 20, 0],
          x: [0, -40, 30, -20, 0],
          rotate: [0, -12, 8, -15, 0]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          ease: "linear",
          delay: 0.5
        }}
        className="absolute left-[30%] top-[45%]"
      >
        <div className="h-[112px] w-[112px] text-purple-600/15">
          {React.cloneElement(icons[1] as React.ReactElement, { size: "100%" })}
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, -30, 40, -20, 0],
          x: [0, -25, 35, -30, 0],
          rotate: [0, 15, -12, 8, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 1
        }}
        className="absolute right-[40%] bottom-[35%]"
      >
        <div className="h-[90px] w-[90px] text-indigo-600/20">
          {React.cloneElement(icons[2] as React.ReactElement, { size: "100%" })}
        </div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 35, -25, 30, 0],
          x: [0, 25, -35, 20, 0],
          rotate: [0, -8, 12, -15, 0]
        }}
        transition={{ 
          duration: 22,
          repeat: Infinity,
          ease: "linear",
          delay: 1.5
        }}
        className="absolute left-[15%] bottom-[20%]"
      >
        <div className="h-[80px] w-[80px] text-purple-600/10">
          {React.cloneElement(icons[0] as React.ReactElement, { size: "100%" })}
        </div>
      </motion.div>

      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <HeroContent />
      </div>
    </div>
  );
}