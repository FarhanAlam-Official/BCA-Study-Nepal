import { motion } from 'framer-motion';

const GlowingBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Primary gradient layer */}
      <div className="absolute -inset-[10px] opacity-40">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-indigo-500/60 via-purple-500/60 to-pink-500/60 rounded-lg blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary gradient layer */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-teal-500/50 rounded-lg blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Accent gradient layer */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-purple-500/10 rounded-lg blur-2xl"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default GlowingBackground;