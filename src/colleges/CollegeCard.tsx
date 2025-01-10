import { motion } from 'framer-motion';
import { MapPin, Phone, Building2, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { College } from '../services/types/college.types';

interface CollegeCardProps {
    college: College;
    index: number;
}

export default function CollegeCard({ college, index }: CollegeCardProps) {
    const navigate = useNavigate();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
        >
            <div className="flex flex-col sm:flex-row">
                <div className="relative flex-shrink-0 w-full sm:w-48 h-48">
                    <img
                        className="absolute inset-0 w-full h-full object-cover"
                        src={college.image || '/placeholder.jpg'}
                        alt={college.name}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 hover:bg-opacity-10" />
                </div>

                <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-gray-900 font-poppins">
                            {college.name}
                        </h3>
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium text-yellow-700">
                                {Number(college.rating || 0).toFixed(1)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center text-gray-600">
                            <MapPin className="h-5 w-5 mr-2" />
                            <span>{college.location}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <Phone className="h-5 w-5 mr-2" />
                            <span>{college.contact}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <Building2 className="h-5 w-5 mr-2" />
                            <span>{college.affiliation}</span>
                        </div>
                    </div>

                    <motion.button
                        onClick={() => navigate(`/colleges/${college.id}`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium text-sm"
                    >
                        View Details
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}