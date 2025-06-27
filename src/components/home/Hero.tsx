import React from 'react';
import { motion } from 'framer-motion';
import { Code, GraduationCap, Briefcase } from 'lucide-react';
import HeroContent from './HeroContent';

/**
 * Hero Component
 * 
 * A visually engaging hero section with animated floating icons and gradient background.
 * Features multiple animated icons that float in different patterns to create visual interest.
 * 
 * Visual Elements:
 * - Gradient background transitioning from indigo to purple to white
 * - Four floating icons with different sizes and animations
 * - Responsive layout with centered content
 * 
 * Animation Features:
 * - Continuous floating animations with different patterns for each icon
 * - Smooth transitions using Framer Motion
 * - Varied delays to create natural movement
 * - Combined translate and rotation animations
 * 
 * @component
 */
export default function Hero() {
  // Define icons to be used in floating animations
  const icons = [
    <Code size="100%" />,
    <GraduationCap size="100%" />,
    <Briefcase size="100%" />
  ];

  // Animation configurations for floating icons
  const floatingAnimations = [
    {
      position: "right-[25%] top-[15%]",
      size: "h-28 w-28",
      color: "text-indigo-600/20",
      animate: { 
        y: [0, -50, 20, -30, 0],
        x: [0, 30, -20, 40, 0],
        rotate: [0, 10, -8, 12, 0]
      },
      transition: { 
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    },
    {
      position: "left-[30%] top-[45%]",
      size: "h-[112px] w-[112px]",
      color: "text-purple-600/15",
      animate: { 
        y: [0, 40, -30, 20, 0],
        x: [0, -40, 30, -20, 0],
        rotate: [0, -12, 8, -15, 0]
      },
      transition: { 
        duration: 18,
        repeat: Infinity,
        ease: "linear",
        delay: 0.5
      }
    },
    {
      position: "right-[40%] bottom-[35%]",
      size: "h-[90px] w-[90px]",
      color: "text-indigo-600/20",
      animate: { 
        y: [0, -30, 40, -20, 0],
        x: [0, -25, 35, -30, 0],
        rotate: [0, 15, -12, 8, 0]
      },
      transition: { 
        duration: 15,
        repeat: Infinity,
        ease: "linear",
        delay: 1
      }
    },
    {
      position: "left-[15%] bottom-[20%]",
      size: "h-[80px] w-[80px]",
      color: "text-purple-600/10",
      animate: { 
        y: [0, 35, -25, 30, 0],
        x: [0, 25, -35, 20, 0],
        rotate: [0, -8, 12, -15, 0]
      },
      transition: { 
        duration: 22,
        repeat: Infinity,
        ease: "linear",
        delay: 1.5
      }
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-purple-50 to-white" />
      
      {/* Floating animated icons */}
      {floatingAnimations.map((config, index) => (
        <motion.div
          key={`floating-icon-${index}`}
          animate={config.animate}
          transition={config.transition}
          className={`absolute ${config.position}`}
        >
          <div className={`${config.size} ${config.color}`}>
            {React.cloneElement(icons[index % icons.length] as React.ReactElement, { size: "100%" })}
          </div>
        </motion.div>
      ))}

      {/* Main hero content container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <HeroContent />
      </div>
    </div>
  );
}