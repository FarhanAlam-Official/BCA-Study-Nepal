import { motion } from 'framer-motion';
import CollegeList from '../colleges/CollegeList';
import AnimatedPageHeader from '../components/common/AnimatedPageHeader';
import { GraduationCap, Building2, Award } from 'lucide-react';

export default function Colleges() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <AnimatedPageHeader
        title="BCA Colleges"
        subtitle="Find Your Perfect College"
        description="Discover top-rated colleges offering BCA programs. Compare, explore, and find your perfect educational institution with comprehensive information about courses, facilities, and more."
        buttonText="Explore Colleges"
        onButtonClick={() => document.getElementById('collegeList')?.scrollIntoView({ behavior: 'smooth' })}
        icons={[
          <GraduationCap size="100%" />,
          <Building2 size="100%" />,
          <Award size="100%" />
        ]}
      />

      {/* Main content */}
      <motion.main
        id="collegeList"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 py-12"
      >
        <CollegeList />
      </motion.main>
    </div>
  );
}