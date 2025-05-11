/**
 * Animation Utilities
 * A collection of Framer Motion animation variants for consistent animations across the application.
 * These animations are designed to be reusable and customizable for different components.
 */

/**
 * Creates a fade-in animation from a specified direction
 * @param direction - The direction from which the element should fade in ('up', 'down', 'left', 'right')
 * @returns Framer Motion animation variants for fade-in effect
 */
export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right') => {
  return {
    hidden: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: 0.15
      }
    }
  }
}

/**
 * Animation variant for staggered children animations
 * Used to create a cascading effect when multiple child elements appear
 */
export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

/**
 * Floating animation effect
 * Creates a smooth up-and-down floating motion with spring physics
 * Ideal for elements that need to appear light or floating
 */
export const floatingAnimation = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

/**
 * Container animation for parent elements
 * Handles the reveal of multiple child elements with staggered timing
 * Children will appear one after another with a slight delay
 */
export const containerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

/**
 * Text reveal animation
 * Specifically designed for text elements with spring physics
 * Creates a smooth upward reveal with carefully tuned spring parameters
 */
export const textReveal = {
  hidden: {
    y: 20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
}; 