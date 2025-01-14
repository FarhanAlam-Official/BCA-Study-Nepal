import React from 'react';
import { Briefcase, GraduationCap, Award, MapPin, Clock, Code } from 'lucide-react';
import { careerData } from '../data/career';
import { motion} from 'framer-motion';
import { fadeIn, staggerContainer } from '../services/utils/animation';
import AnimatedPageHeader from '../components/common/AnimatedPageHeader';

export default function Career() {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="relative min-h-screen"
    >
      <AnimatedPageHeader
        title="Career Options"
        subtitle="for BCA Graduates"
        description="Discover exciting opportunities and chart your path to success"
        buttonText="Explore Opportunities"
        onButtonClick={() => console.log('Button clicked')}
      />

      <div className="relative z-20 bg-white px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        {/* Higher Education Section with enhanced animations */}
        <section className="py-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl font-bold text-gray-900 mb-12 flex items-center"
          >
            <GraduationCap className="h-8 w-8 mr-3 text-indigo-600" />
            Higher Education Opportunities
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Nepal Education with enhanced animation */}
            <motion.div 
              initial={{ x: -100, opacity: 0, rotateY: 45 }}
              whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                bounce: 0.4 
              }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:border-indigo-500 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
                Study in Nepal
              </h3>
              <div className="space-y-4">
                {careerData.higherEducation.nepal.map((course, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Abroad Education with enhanced animation */}
            <motion.div 
              initial={{ x: 100, opacity: 0, rotateY: -45 }}
              whileInView={{ x: 0, opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                bounce: 0.4,
                delay: 0.2
              }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:border-indigo-500 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
                Study Abroad
              </h3>
              <div className="space-y-4">
                {careerData.higherEducation.abroad.map((course, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <h4 className="font-medium text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Job Roles Section with staggered reveal */}
        <section className="py-20">
          <motion.h2 
            variants={fadeIn('up')}
            className="text-3xl font-bold text-gray-900 mb-12 flex items-center"
          >
            <Briefcase className="h-8 w-8 mr-3 text-indigo-600" />
            Job Opportunities
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {careerData.jobRoles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  bounce: 0.4
                }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  transition: { duration: 0.3 }
                }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {role.location}
                </div>
                <p className="mt-2 text-sm text-gray-600">{role.description}</p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 hover:from-indigo-100 hover:to-purple-100 transition-colors duration-200"
                      >
                        <Code className="h-4 w-4 mr-1" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certifications with 3D rotation effect */}
        <section className="py-20">
          <motion.h2 
            variants={fadeIn('up')}
            className="text-3xl font-bold text-gray-900 mb-12 flex items-center"
          >
            <Award className="h-8 w-8 mr-3 text-indigo-600" />
            Professional Certifications
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {careerData.certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, rotateX: 45, y: 50 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.15,
                  type: "spring",
                  bounce: 0.3
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Award className="h-4 w-4 mr-1" />
                    {cert.provider}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {cert.duration}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}