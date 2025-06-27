import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Building2, Star, Calendar, Globe, Mail, BookOpen, LucideIcon, CheckCircle2 } from 'lucide-react';
import { collegeService } from '../services/api/collegeService';
import { College } from '../services/types/college.types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CollegeDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { slug } = useParams();
    const [college, setCollege] = useState<College | null>(state?.college || null);
    const [loading, setLoading] = useState(!state?.college);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, []);

    useEffect(() => {
        if (!state?.college && slug && slug !== 'null') {
            const fetchCollege = async () => {
                try {
                    const data = await collegeService.getBySlug(slug);
                    setCollege(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchCollege();
        }
    }, [slug, state?.college]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoadingSpinner size="large" />
        </div>
    );

    if (!college) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md mx-auto px-4"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-3">College Not Found</h2>
                <p className="text-gray-600 mb-6">The college you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/colleges')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white 
                             rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Return to College List
                </button>
            </motion.div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50"
        >
            {/* Hero Section - Adjusted positioning */}
            <div className="relative h-[60vh] lg:h-[70vh] bg-gray-900">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 0.6 }}
                    src={college.image}
                    alt={college.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
                
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-10 flex items-center px-4 py-2 
                             bg-white/90 rounded-lg shadow-lg hover:bg-white 
                             transition-all duration-200 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 
                                       transition-transform duration-200" />
                    <span>Back</span>
                </button>

                <div className="absolute bottom-16 left-0 right-0 px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                                {college.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/90">
                                <div className="flex items-center">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span className="ml-2 font-medium">{college.rating}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-5 h-5" />
                                    <span className="ml-2">{college.location}</span>
                                </div>
                                <div className="flex items-center">
                                    <Building2 className="w-5 h-5" />
                                    <span className="ml-2">{college.institution_type}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            {/* Tabs */}
                            <div className="border-b border-gray-100">
                                <nav className="flex">
                                    {['overview', 'courses', 'facilities', 'contact'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-6 py-4 text-sm font-medium transition-all duration-200
                                                     ${activeTab === tab 
                                                         ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                                                         : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'overview' && (
                                        <motion.div
                                            key="overview"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <p className="text-gray-600 leading-relaxed">
                                                {college.description}
                                            </p>
                                            {college.achievements && (
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                                        Achievements
                                                    </h3>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {college.achievements}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === 'courses' && (
                                        <motion.div
                                            key="courses"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Courses</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {college.courses_offered?.map((course, index) => (
                                                    <div 
                                                        key={index}
                                                        className="p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 
                                                                 transition-colors duration-200"
                                                    >
                                                        <span className="text-gray-800">{course}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'facilities' && (
                                        <motion.div
                                            key="facilities"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Campus Facilities</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {college.facilities?.map((facility, index) => (
                                                    <div 
                                                        key={index}
                                                        className="flex items-center p-4 bg-gray-50 rounded-lg 
                                                                 transition-colors duration-200"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                                                        <span className="text-gray-800">{facility}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'contact' && (
                                        <motion.div
                                            key="contact"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
                                                    <div className="space-y-3">
                                                        <ContactInfo icon={Phone} label="Primary Contact" value={college.contact_primary} />
                                                        {college.contact_secondary && (
                                                            <ContactInfo icon={Phone} label="Secondary Contact" value={college.contact_secondary} />
                                                        )}
                                                        <ContactInfo icon={Mail} label="Email Address" value={college.email} />
                                                        <ContactInfo icon={Globe} label="Website" value={college.website || ''} isLink />
                                                        <ContactInfo icon={MapPin} label="Address" value={college.location} />
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold text-gray-900">Office Hours</h3>
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                                                        <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                                                        <p className="text-gray-600">Sunday: Closed</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Quick Info Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <InfoCard icon={Calendar} label="Established" 
                                     value={new Date(college.created_at).getFullYear()} />
                            <InfoCard icon={BookOpen} label="Courses" 
                                     value={`${college.courses_offered?.length || 0}+`} />
                        </div>

                        {/* Contact Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                            <div className="space-y-4">
                                <ContactInfo icon={Phone} label="Phone" value={college.contact_primary} />
                                <ContactInfo icon={Mail} label="Email" value={college.email} />
                                <ContactInfo icon={Globe} label="Website" value={college.website || ''} isLink />
                            </div>
                            
                            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg 
                                           hover:bg-indigo-700 active:bg-indigo-800
                                           transition-colors duration-200 font-medium
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                           focus:ring-offset-2">
                                Apply Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

// Helper Components
const InfoCard = ({ icon: Icon, label, value }: { 
    icon: LucideIcon, 
    label: string, 
    value: string | number 
}) => (
    <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <Icon className="w-5 h-5 text-blue-500 mb-2" />
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-semibold text-gray-900">{value}</div>
    </div>
);

const ContactInfo = ({ icon: Icon, label, value, isLink = false }: { 
    icon: LucideIcon, 
    label: string, 
    value: string, 
    isLink?: boolean 
}) => (
    <div className="flex items-start">
        <Icon className="w-5 h-5 text-gray-400 mt-1" />
        <div className="ml-3">
            <div className="text-sm text-gray-500">{label}</div>
            {isLink ? (
                <a 
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                >
                    {value}
                </a>
            ) : (
                <div className="text-gray-900">{value}</div>
            )}
        </div>
    </div>
);