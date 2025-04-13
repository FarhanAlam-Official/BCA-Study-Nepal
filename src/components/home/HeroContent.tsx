import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HeroContent = () => {
  return (
    <motion.div 
      className="text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-2 sm:py-4 lg:py-8"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      {/* Sparkle icon with enhanced glow effect */}
      <motion.div 
        variants={fadeInUp}
        className="flex justify-center mb-1"
      >
        <div className="relative">
          <Sparkles className="h-10 w-10 text-indigo-600 animate-pulse" />
          <div className="absolute inset-0 bg-indigo-400/30 blur-3xl rounded-full scale-150" />
        </div>
      </motion.div>

      {/* Main heading with enhanced gradient */}
      <motion.h1 
        variants={fadeInUp}
        className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight space-y-0"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">
          Your Gateway to
        </span>
        <br />
        <span className="text-gray-900 drop-shadow-sm">BCA Excellence</span>
      </motion.h1>

      {/* Enhanced subheading */}
      <motion.p 
        variants={fadeInUp}
        className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed"
      >
        Access comprehensive study materials, explore colleges, and discover career opportunities - all in one place.
      </motion.p>

      {/* Enhanced CTA buttons */}
      <motion.div 
        variants={fadeInUp}
        className="mt-10 flex flex-col sm:flex-row gap-5 justify-center"
      >
        <Link
          to="/notes"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-white transition-all duration-300 ease-out hover:scale-105 shadow-lg hover:shadow-indigo-500/30"
        >
          <span className="absolute right-0 translate-x-full group-hover:-translate-x-4 transition-transform">
            <ArrowRight className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold group-hover:pr-4 transition-all">Get Started</span>
        </Link>
        
        <Link
          to="/colleges"
          className="group inline-flex items-center justify-center rounded-xl border-2 border-indigo-600 bg-transparent px-8 py-4 text-indigo-600 transition-all duration-300 hover:bg-indigo-50 hover:scale-105 shadow-lg hover:shadow-indigo-500/10"
        >
          <span className="text-lg font-semibold">View Colleges</span>
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Enhanced feature cards */}
      <motion.div 
        variants={fadeInUp}
        className="mt-48 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 px-4"
      >
        {[
          { 
            icon: BookOpen, 
            title: 'Study Materials', 
            desc: 'Access comprehensive notes and resources for every semester',
            gradient: 'from-blue-500 to-indigo-500'
          },
          { 
            icon: GraduationCap, 
            title: 'Top Colleges', 
            desc: 'Explore and compare the best BCA colleges across India',
            gradient: 'from-indigo-500 to-purple-500'
          },
          { 
            icon: Sparkles, 
            title: 'Career Growth', 
            desc: 'Discover exciting opportunities and career paths',
            gradient: 'from-purple-500 to-pink-500'
          }
        ].map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="relative group rounded-xl bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl border border-gray-100"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-xl`} />
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 w-fit">
                <feature.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;