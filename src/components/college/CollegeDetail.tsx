/**
 * CollegeDetail component displays detailed information about a specific college
 * Handles loading college data, view tracking, and displaying various sections of college information
 */

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Star,
  Calendar,
  Globe,
  LucideIcon,
  CheckCircle2,
  School,
  SparklesIcon,
  Phone,
  Mail
} from 'lucide-react';
import { College } from './college';
import { collegeApi } from './collegeApi';
import { StarIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-hot-toast';

/**
 * Props for the InfoCard component
 */
interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

/**
 * Props for the ContactInfo component
 */
interface ContactInfoProps {
  icon: LucideIcon;
  label: string;
  value: string;
  isLink?: boolean;
}

/**
 * Reusable card component for displaying college information
 */
const InfoCard = ({ icon: Icon, label, value }: InfoCardProps) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex items-start gap-3 hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-50/30 group">
    <div className="p-2.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-300">
      <Icon className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 mb-1 group-hover:text-indigo-600 transition-colors duration-300">{label}</p>
      <p className="font-medium text-gray-900 group-hover:text-indigo-900 transition-colors duration-300">{value}</p>
    </div>
  </div>
);

/**
 * Reusable component for displaying contact information with optional link functionality
 */
const ContactInfo = ({ icon: Icon, label, value, isLink = false }: ContactInfoProps) => (
  <div className="flex items-center gap-3 p-4 rounded-lg hover:bg-indigo-50/30 transition-all duration-300 group">
    <div className="p-2.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-300">
      <Icon className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 mb-1 group-hover:text-indigo-600 transition-colors duration-300">{label}</p>
      {isLink ? (
        <a
          href={value.toString().startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-all duration-200"
        >
          {value}
        </a>
      ) : (
        <p className="font-medium text-gray-900 group-hover:text-indigo-900 transition-colors duration-300">{value}</p>
      )}
    </div>
  </div>
);

export default function CollegeDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [college, setCollege] = useState<College | null>(state?.college || null);
  const [loading, setLoading] = useState(!state?.college);
  const [activeTab, setActiveTab] = useState('overview');
  const [isHovering, setIsHovering] = useState(false);

  /**
   * Handles navigation back to the previous page or colleges list
   */
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/colleges');
    }
  };

  useEffect(() => {
    if (!state?.college && id) {
      const fetchCollege = async () => {
        try {
          // First increment the view count
          await collegeApi.incrementView(id);
          // Then fetch the updated college data
          const response = await collegeApi.getCollege(id);
          setCollege(response);
        } catch (err) {
          toast.error('Failed to load college details. Please try again later.');
          if (import.meta.env.DEV) {
            console.error('Failed to fetch college:', err);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchCollege();
    } else if (state?.college) {
      // For navigation from list, increment view then fetch fresh data
      const handleStateCollege = async () => {
        try {
          await collegeApi.incrementView(state.college.id);
          const response = await collegeApi.getCollege(state.college.id);
          setCollege(response);
        } catch (err) {
          toast.error('Failed to update college information. Please try again later.');
          if (import.meta.env.DEV) {
            console.error('Failed to handle college from state:', err);
          }
        }
      };
      handleStateCollege();
    }
  }, [id, state?.college]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Save the current scroll position of the college list page
    const currentScrollPos = window.scrollY;
    if (currentScrollPos > 0) {
      sessionStorage.setItem('collegeListScrollPos', currentScrollPos.toString());
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-3">College Not Found</h2>
          <p className="text-gray-600 mb-6">The college you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to College List
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] bg-gray-900 overflow-hidden">
        {/* Cover Image Container */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Fallback gradient */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          
          {/* Cover image */}
          {college.display_cover && (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src={college.display_cover.startsWith('http') || college.display_cover.startsWith('//')
                  ? college.display_cover 
                  : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${college.display_cover}`}
                alt={`${college.name} cover`}
                className="w-full h-full object-cover object-center transform scale-110"
                style={{ 
                  width: '100%',
                  height: '100%',
                  display: 'block'
                }}
                onError={(e) => {
                  if (import.meta.env.DEV) {
                    console.error('Failed to load cover image:', college.display_cover);
                  }
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
          
{/* Featured Badge */}
{college.is_featured && (
  <div className="absolute top-6 right-6 z-10">
    <motion.div
      initial={{ rotate: -15, scale: 0.5 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-3 hover:shadow-indigo-400/50 hover:scale-110 transition-all duration-300"
    >
      <SparklesIcon className="w-7 h-7 text-white/90 animate-pulse" />
      <span className="text-base font-semibold">Featured</span>
    </motion.div>
  </div>
)}
        </div>

        <motion.button
          onClick={handleBack}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-indigo-50 hover:shadow-indigo-400/50 transition-all duration-300 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ x: isHovering ? -4 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-5 h-5 text-indigo-600 group-hover:text-indigo-700" />
          </motion.div>
          <span className="font-medium text-gray-800 group-hover:text-indigo-700">Back</span>
        </motion.button>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 mb-16 md:mb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg transform hover:scale-105 hover:bg-indigo-50 hover:shadow-indigo-100/50 transition-all duration-300">
                {college.display_logo ? (
                  <img
                    src={college.display_logo.startsWith('http') || college.display_logo.startsWith('//')
                      ? college.display_logo
                      : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${college.display_logo}`}
                    alt={`${college.name} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      if (import.meta.env.DEV) {
                        console.error('Failed to load logo:', college.display_logo);
                      }
                      (e.target as HTMLImageElement).style.display = 'none';
                      e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-indigo-400 group-hover:text-indigo-500" />
                  </div>
                )}
                <div className="hidden fallback-icon w-full h-full flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-indigo-400 group-hover:text-indigo-500" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 hover:text-white/90 transition-colors duration-300">
                  {college.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90">
                  <div className="flex items-center group">
                    <div className="flex items-center hover:scale-105 transition-transform duration-300">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon
                          key={i}
                          className={`w-5 h-5 ${
                            i <= Math.round(college.rating || 0)
                              ? 'text-yellow-400 group-hover:text-yellow-300'
                              : 'text-gray-300 group-hover:text-gray-200'
                          } transition-colors duration-300`}
                        />
                      ))}
                      <span className="ml-2 group-hover:text-white transition-colors duration-300">
                        ({college.views_count || 0})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center group hover:scale-105 transition-transform duration-300">
                    <MapPin className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" />
                    <span className="ml-2 group-hover:text-white transition-colors duration-300">
                      {college.location || 'Location not specified'}
                    </span>
                  </div>
                  <div className="flex items-center group hover:scale-105 transition-transform duration-300">
                    <School className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" />
                    <span className="ml-2 group-hover:text-white transition-colors duration-300">
                      Est. {college.established_year || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300"
            >
              {/* Tabs */}
              <div className="border-b border-gray-100">
                <nav className="flex overflow-x-auto">
                  {['overview', 'programs', 'facilities', 'contact'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300
                               ${activeTab === tab 
                                   ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 hover:bg-indigo-50' 
                                   : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50/30'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4 md:p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 min-h-[350px]"
                    >
                      <div className="prose prose-indigo max-w-none mb-6">
                        <p className="text-gray-600 leading-relaxed hover:text-gray-900 transition-colors duration-300">
                          {college.description || 'No description available.'}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoCard
                          icon={Calendar}
                          label="Established"
                          value={college.established_year || 'N/A'}
                        />
                        <InfoCard
                          icon={Star}
                          label="Rating"
                          value={`${college.rating || 0}/5 (${college.views_count || 0} views)`}
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'programs' && (
                    <motion.div
                      key="programs"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-[350px] flex flex-col overflow-hidden"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Available Programs
                      </h3>
                      <div 
                        className="overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-100 pr-4"
                        style={{ height: 'calc(100% - 40px)' }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                          {(college.programs || []).map((program: string, index: number) => (
                            <div 
                              key={index}
                              className="p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-all duration-300 hover:shadow-md hover:scale-[1.02] group"
                            >
                              <span className="text-gray-800 group-hover:text-indigo-900 transition-colors duration-300">{program}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'facilities' && (
                    <motion.div
                      key="facilities"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-[350px] flex flex-col overflow-hidden"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Campus Facilities
                      </h3>
                      <div 
                        className="overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-100 pr-4"
                        style={{ height: 'calc(100% - 40px)' }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                          {(college.facilities || []).map((facility, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-indigo-50/50 transition-all duration-300 hover:shadow-md hover:scale-[1.02] group"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                              <span className="text-gray-700 group-hover:text-indigo-900 transition-colors duration-300">{facility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'contact' && (
                    <motion.div
                      key="contact"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 min-h-[350px]"
                    >
                      <div className="grid grid-cols-1 gap-4">
                        <ContactInfo
                          icon={Globe}
                          label="Website"
                          value={college.website}
                          isLink
                        />
                        <ContactInfo
                          icon={Mail}
                          label="Email"
                          value={college.email}
                          isLink
                        />
                        {college.contact_numbers.primary && (
                          <ContactInfo
                            icon={Phone}
                            label="Primary Contact"
                            value={college.contact_numbers.primary}
                          />
                        )}
                        {college.contact_numbers.secondary && (
                          <ContactInfo
                            icon={Phone}
                            label="Secondary Contact"
                            value={college.contact_numbers.secondary}
                          />
                        )}
                        {college.contact_numbers.tertiary && (
                          <ContactInfo
                            icon={Phone}
                            label="Additional Contact"
                            value={college.contact_numbers.tertiary}
                          />
                        )}
                        <ContactInfo
                          icon={MapPin}
                          label="Location"
                          value={college.location}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-indigo-900">
                Admission Status
              </h3>
              <div className={`
                inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transform hover:scale-105 transition-all duration-300
                ${college.admission_status?.toLowerCase() === 'open' 
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' :
                  college.admission_status?.toLowerCase() === 'upcoming' 
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                  college.admission_status?.toLowerCase() === 'closed' 
                  ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                  'bg-gray-100 text-gray-800 hover:bg-gray-200'}
              `}>
                {college.admission_status ? 
                  college.admission_status.charAt(0).toUpperCase() + 
                  college.admission_status.slice(1).toLowerCase() : 
                  'Status Unknown'}
              </div>
            </motion.div>

            {college.is_featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-md p-6 text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 fill-current group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-semibold group-hover:text-white/90 transition-colors duration-300">Featured College</h3>
                </div>
                <p className="text-white/90 group-hover:text-white transition-colors duration-300">
                  This is one of our top-rated educational institutions with excellent facilities and academic programs.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: #4f46e5;
          border-radius: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: #4338ca;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #4f46e5 #f3f4f6;
        }
      `}</style>
    </motion.div>
  );
} 