import { motion } from 'framer-motion';
import { CollegeProvider } from '../context/CollegeContext';
import CollegeList from '../colleges/CollegeList';
// import AnimatedPageHeader from '../components/common/AnimatedPageHeader';

export default function Colleges() {
  return (
    <CollegeProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 font-poppins">
            BCA Colleges
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Discover top-rated colleges offering BCA programs. Compare, explore, and find your perfect educational institution.
          </p>
        </motion.div>

        {/* Main content */}
        <main>
          <CollegeList />
        </main>
      </div>
    </CollegeProvider>
  );
}