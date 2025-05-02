import React from 'react';
import { Briefcase, GraduationCap, Award, MapPin, Clock, Code, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../services/utils/animation';
import AnimatedPageHeader from '../../components/common/AnimatedPageHeader';

// Floating Icon Component Types
interface FloatingIconProps {
  icon: React.ElementType;
  className: string;
  animate: {
    y?: number[] | number;
    x?: number[] | number;
    rotate?: number[] | number;
  };
  transition: {
    duration: number;
    repeat?: number;
    ease?: string;
    delay?: number;
  };
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ icon: Icon, className, animate, transition }) => (
  <motion.div
    animate={animate}
    transition={transition}
    className={className}
  >
    <div className="text-indigo-600/20">
      <Icon size="100%" />
    </div>
  </motion.div>
);

// Data Constants
const higherEducationNepal = [
  {
    title: "Master of Computer Applications (MCA)",
    description: "Advanced degree focusing on software development, database management, and system architecture. Popular universities include Tribhuvan University and Kathmandu University.",
    duration: "2 Years"
  },
  {
    title: "MBA (IT)",
    description: "Blend of business and IT knowledge, preparing graduates for management roles in tech companies. Offered by leading business schools in Nepal.",
    duration: "2 Years"
  },
  {
    title: "M.Sc. in Information Technology",
    description: "Research-oriented program covering advanced computing concepts, AI, and emerging technologies.",
    duration: "2 Years"
  },
  {
    title: "M.Sc. in Artificial Intelligence",
    description: "Specialized program focusing on machine learning, deep learning, and AI applications. Growing demand in both academia and industry.",
    duration: "2 Years"
  }
];

const higherEducationAbroad = [
  {
    title: "Master's in Data Science",
    description: "Advanced program covering big data analytics, machine learning, and statistical analysis. High demand in countries like USA, UK, and Australia.",
    duration: "1.5-2 Years"
  },
  {
    title: "Master's in Computer Science",
    description: "Comprehensive program covering advanced algorithms, software engineering, and specialized tracks like AI or cybersecurity.",
    duration: "2 Years"
  },
  {
    title: "Master's in Cybersecurity",
    description: "Specialized degree focusing on network security, ethical hacking, and security architecture. Growing demand globally.",
    duration: "1.5-2 Years"
  },
  {
    title: "Master's in Cloud Computing",
    description: "Focused on cloud architecture, DevOps, and distributed systems. Highly sought after in the current job market.",
    duration: "1.5-2 Years"
  }
];

const jobRoles = [
  {
    title: "Full Stack Developer",
    location: "Remote/Hybrid/On-site",
    description: "Design and develop both frontend and backend of web applications. Work with modern frameworks and cloud services.",
    skills: ["JavaScript/TypeScript", "React/Angular/Vue", "Node.js", "Python", "AWS/Azure", "DevOps", "Database Management"],
    salaryRange: "NPR 60,000 - 200,000/month",
    growthProspect: "High demand with 25% YoY growth"
  },
  {
    title: "Data Scientist",
    location: "Remote/Hybrid/On-site",
    description: "Analyze complex data sets to help organizations make better decisions. Build predictive models and machine learning solutions.",
    skills: ["Python", "R", "SQL", "Machine Learning", "Deep Learning", "Statistics", "Data Visualization"],
    salaryRange: "NPR 70,000 - 250,000/month",
    growthProspect: "Rapidly growing field with 30% YoY increase"
  },
  {
    title: "Cloud Solutions Architect",
    location: "Remote/Hybrid",
    description: "Design and implement cloud infrastructure solutions. Work with major cloud providers and modern architectures.",
    skills: ["AWS/Azure/GCP", "DevOps", "Containerization", "Microservices", "Security", "System Design"],
    salaryRange: "NPR 100,000 - 300,000/month",
    growthProspect: "High demand with cloud adoption increasing"
  },
  {
    title: "DevOps Engineer",
    location: "Remote/Hybrid",
    description: "Implement CI/CD pipelines, manage cloud infrastructure, and optimize development workflows.",
    skills: ["Docker", "Kubernetes", "Jenkins", "Git", "Linux", "Scripting", "Cloud Platforms"],
    salaryRange: "NPR 80,000 - 250,000/month",
    growthProspect: "Essential role in modern development teams"
  },
  {
    title: "AI/ML Engineer",
    location: "Remote/Hybrid/On-site",
    description: "Develop and deploy machine learning models and AI solutions for real-world problems.",
    skills: ["Python", "TensorFlow/PyTorch", "Deep Learning", "NLP", "Computer Vision", "MLOps"],
    salaryRange: "NPR 90,000 - 300,000/month",
    growthProspect: "Exponential growth with AI adoption"
  },
  {
    title: "Cybersecurity Analyst",
    location: "Remote/Hybrid",
    description: "Protect organizations from cyber threats and implement security measures.",
    skills: ["Network Security", "Penetration Testing", "Security Tools", "Risk Assessment", "Incident Response"],
    salaryRange: "NPR 70,000 - 250,000/month",
    growthProspect: "Critical role with increasing cyber threats"
  }
];

const certifications = [
  {
    name: "AWS Certified Solutions Architect",
    provider: "Amazon Web Services",
    duration: "Self-paced, typically 2-3 months",
    level: "Associate/Professional",
    cost: "$150-$300",
    validity: "3 years"
  },
  {
    name: "Google Cloud Professional Architect",
    provider: "Google Cloud",
    duration: "Self-paced, typically 3-4 months",
    level: "Professional",
    cost: "$200",
    validity: "2 years"
  },
  {
    name: "Microsoft Azure Solutions Architect",
    provider: "Microsoft",
    duration: "Self-paced, typically 2-3 months",
    level: "Expert",
    cost: "$165",
    validity: "2 years"
  },
  {
    name: "Certified Information Systems Security Professional (CISSP)",
    provider: "ISC²",
    duration: "Self-paced, typically 4-6 months",
    level: "Professional",
    cost: "$699",
    validity: "3 years"
  },
  {
    name: "TensorFlow Developer Certificate",
    provider: "Google",
    duration: "Self-paced, typically 2-3 months",
    level: "Professional",
    cost: "$100",
    validity: "No expiration"
  },
  {
    name: "Kubernetes Administrator (CKA)",
    provider: "Cloud Native Computing Foundation",
    duration: "Self-paced, typically 2-3 months",
    level: "Professional",
    cost: "$395",
    validity: "3 years"
  }
];

// Function to get certification links
const getCertificationLink = (certName: string): string => {
  const links: { [key: string]: string } = {
    'AWS Certified Solutions Architect': 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    'Google Cloud Professional Architect': 'https://cloud.google.com/certification/cloud-architect',
    'Microsoft Azure Solutions Architect': 'https://learn.microsoft.com/en-us/certifications/azure-solutions-architect/',
    'Certified Information Systems Security Professional (CISSP)': 'https://www.isc2.org/Certifications/CISSP',
    'TensorFlow Developer Certificate': 'https://www.tensorflow.org/certificate',
    'Kubernetes Administrator (CKA)': 'https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/'
  };
  return links[certName] || '#';
};

export default function Career() {
  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="relative min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_10%,transparent_70%)] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5" />

        {/* Animated Background Wave */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute top-1/3 left-0 w-full h-40 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-3xl opacity-20" />
          <div className="absolute top-2/3 -left-1/3 w-[166%] h-32 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-3xl opacity-20" />
        </motion.div>

        {/* Shimmering Effect */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundSize: "200% 200%",
            backgroundImage: "linear-gradient(45deg, transparent 0%, transparent 45%, rgba(255,255,255,0.15) 50%, transparent 55%, transparent 100%)",
          }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.1]" />
      </div>

      {/* Floating Elements */}
      <FloatingIcon
        icon={Code}
        className="absolute h-28 w-28 right-[15%] top-[15%]"
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />

      <FloatingIcon
        icon={GraduationCap}
        className="absolute h-[112px] w-[112px] left-[20%] top-[25%]"
        animate={{ 
          y: [0, 30, 0],
          x: [0, -20, 0],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      <FloatingIcon
        icon={Trophy}
        className="absolute h-[90px] w-[90px] right-[25%] bottom-[20%]"
        animate={{ 
          y: [0, -20, 0],
          x: [0, -15, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      <AnimatedPageHeader
        title="Career Options"
        subtitle="for BCA Graduates"
        description="Discover exciting opportunities and chart your path to success"
        buttonText="Explore Opportunities"
        onButtonClick={() => document.getElementById('careerContent')?.scrollIntoView({ behavior: 'smooth' })}
      />

      <div id="careerContent" className="relative z-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {/* Higher Education Section */}
        <section className="py-24">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-16 flex items-center"
          >
            <GraduationCap className="h-10 w-10 mr-4 text-indigo-600" />
            Higher Education Opportunities
          </motion.h2>
          
          <div className="space-y-16">
            {/* Nepal Education */}
            <div>
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-semibold mb-8 flex items-center text-indigo-900"
              >
                <MapPin className="h-6 w-6 mr-3 text-indigo-600" />
                Study in Nepal
              </motion.h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {higherEducationNepal.map((course, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={index} 
                    className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-indigo-100 p-8 hover:shadow-xl hover:border-indigo-200 hover:bg-gradient-to-b hover:from-white hover:to-indigo-50/30 transition-all duration-300"
                  >
                    <h4 className="text-xl font-semibold text-indigo-900 group-hover:text-indigo-700 transition-colors">{course.title}</h4>
                    <p className="mt-4 text-base text-gray-600 leading-relaxed">{course.description}</p>
                    <div className="mt-6 flex items-center text-sm text-indigo-600 font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      {course.duration}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Abroad Education */}
            <div>
              <motion.h3 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-semibold mb-8 flex items-center text-indigo-900"
              >
                <MapPin className="h-6 w-6 mr-3 text-indigo-600" />
                Study Abroad
              </motion.h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
                {higherEducationAbroad.map((course, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    key={index} 
                    className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-indigo-100 p-8 hover:shadow-xl hover:border-indigo-200 hover:bg-gradient-to-b hover:from-white hover:to-indigo-50/30 transition-all duration-300"
                  >
                    <h4 className="text-xl font-semibold text-indigo-900 group-hover:text-indigo-700 transition-colors">{course.title}</h4>
                    <p className="mt-4 text-base text-gray-600 leading-relaxed">{course.description}</p>
                    <div className="mt-6 flex items-center text-sm text-indigo-600 font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      {course.duration}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Job Roles Section */}
        <section className="py-24">
          <motion.h2 
            variants={fadeIn('up')}
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-16 flex items-center"
          >
            <Briefcase className="h-10 w-10 mr-4 text-indigo-600" />
            Job Opportunities
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {jobRoles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-indigo-100 p-8 hover:shadow-xl hover:border-indigo-200 hover:bg-gradient-to-b hover:from-white hover:to-indigo-50/30 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-indigo-900 group-hover:text-indigo-700 transition-colors">{role.title}</h3>
                <div className="mt-3 flex items-center text-sm text-indigo-600 font-medium">
                  <MapPin className="h-4 w-4 mr-2" />
                  {role.location}
                </div>
                <p className="mt-4 text-base text-gray-600 leading-relaxed">{role.description}</p>
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-100/80 text-indigo-700 hover:bg-indigo-200/80 transition-colors duration-200"
                      >
                        <Code className="h-4 w-4 mr-1.5" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-24">
          <motion.h2 
            variants={fadeIn('up')}
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-16 flex items-center"
          >
            <Award className="h-10 w-10 mr-4 text-indigo-600" />
            Professional Certifications
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-indigo-100 p-8 hover:shadow-xl hover:border-indigo-200 hover:bg-gradient-to-b hover:from-white hover:to-indigo-50/30 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-indigo-900 group-hover:text-indigo-700 transition-colors">{cert.name}</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-base text-indigo-600">
                    <Award className="h-5 w-5 mr-2" />
                    <span className="font-medium">{cert.provider}</span>
                  </div>
                  <div className="flex items-center text-base text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{cert.duration}</span>
                  </div>
                  <a
                    href={getCertificationLink(cert.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}