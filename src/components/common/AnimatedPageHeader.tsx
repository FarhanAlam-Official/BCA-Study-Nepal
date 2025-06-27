import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, GraduationCap, Code } from 'lucide-react';

/**
 * Props interface for the AnimatedPageHeader component
 */
interface AnimatedPageHeaderProps {
  /** Main title of the page */
  title: string;
  /** Optional subtitle displayed below the title */
  subtitle?: string;
  /** Optional description text */
  description?: string;
  /** Optional text for the call-to-action button */
  buttonText?: string;
  /** Optional callback function for button click */
  onButtonClick?: () => void;
  /** Optional array of icons to display in the background */
  icons?: React.ReactNode[];
}

/**
 * Animation configurations for floating elements
 */
const floatingAnimations = {
  first: {
    animate: { 
      y: [0, -30, 0],
      x: [0, 20, 0],
      rotate: [0, 10, -10, 0]
    },
    transition: { 
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut" 
    }
  },
  second: {
    animate: { 
      y: [0, 30, 0],
      x: [0, -20, 0],
      rotate: [0, -10, 10, 0]
    },
    transition: { 
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.5
    }
  },
  third: {
    animate: { 
      y: [0, -20, 0],
      x: [0, -15, 0],
      rotate: [0, 5, -5, 0]
    },
    transition: { 
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1
    }
  },
  fourth: {
    animate: { 
      y: [0, 25, 0],
      x: [0, 15, 0],
      rotate: [0, -5, 5, 0]
    },
    transition: { 
      duration: 9,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1.5
    }
  }
};

/**
 * AnimatedPageHeader Component
 * 
 * A reusable header component with animated floating icons and scroll-based animations.
 * Features a gradient background, animated title, and optional subtitle, description, and CTA button.
 */
export default function AnimatedPageHeader({
  title,
  subtitle,
  description,
  buttonText,
  onButtonClick,
  icons = [
    <Code key="code" size="100%" />,
    <GraduationCap key="graduation" size="100%" />,
    <Briefcase key="briefcase" size="100%" />
  ]
}: AnimatedPageHeaderProps) {
  const { scrollY } = useScroll();
  
  // Memoize scroll-based transforms
  const headerOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const headerY = useTransform(scrollY, [0, 400], [0, -150]);

  // Memoize icon elements to prevent unnecessary re-renders
  const iconElements = useMemo(() => icons.map((icon, index) => 
    React.cloneElement(icon as React.ReactElement, { 
      size: "100%",
      key: `icon-${index}`
    })
  ), [icons]);

  return (
    <motion.div 
      style={{ opacity: headerOpacity, y: headerY }}
      className="h-screen mb-16 flex items-center justify-center overflow-hidden sticky top-0 z-0 bg-gradient-to-b from-indigo-50 via-purple-50 to-white"
    >
      {/* Floating Background Elements */}
      <motion.div
        {...floatingAnimations.first}
        className="absolute right-[15%] top-[25%]"
      >
        <div className="h-28 w-28 text-indigo-600/20">
          {iconElements[0]}
        </div>
      </motion.div>

      <motion.div
        {...floatingAnimations.second}
        className="absolute left-[20%] top-[35%]"
      >
        <div className="h-[112px] w-[112px] text-purple-600/15">
          {iconElements[1]}
        </div>
      </motion.div>

      <motion.div
        {...floatingAnimations.third}
        className="absolute right-[30%] bottom-[25%]"
      >
        <div className="h-[90px] w-[90px] text-indigo-600/20">
          {iconElements[2]}
        </div>
      </motion.div>

      <motion.div
        {...floatingAnimations.fourth}
        className="absolute left-[35%] bottom-[30%]"
      >
        <div className="h-[80px] w-[80px] text-purple-600/10">
          {iconElements[0]}
        </div>
      </motion.div>

      {/* Main Header Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
              {title}
            </span>
          </h1>
          
          {subtitle && (
            <h2 className="text-3xl md:text-4xl font-bold mt-4 text-indigo-900/80">
              {subtitle}
            </h2>
          )}
          
          {description && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          )}
          
          {buttonText && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onButtonClick}
              className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium 
                       hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="button"
              aria-label={buttonText}
            >
              {buttonText}
            </motion.button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}