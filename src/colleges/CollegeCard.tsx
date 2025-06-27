import { useNavigate } from 'react-router-dom';
import {
    MapPin,  Star, School, ArrowRight
} from 'lucide-react';
import type { College } from '../services/types/college.types';

export const CollegeCardGrid = ({ colleges }: { colleges: College[] }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {colleges.map((college) => (
                    <CollegeCard key={college.id} college={college} />
                ))}
            </div>
        </div>
    );
};

const CollegeCard = ({ college }: { college: College }) => {
    const navigate = useNavigate();

    const handleViewCollege = () => {
        navigate(`/colleges/${college.slug}`, { state: { college } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 
                        transition-all duration-300 overflow-hidden border border-gray-100 
                        max-w-sm w-full">
            <div className="relative h-40 overflow-hidden group">
                <img 
                    src={college.image || '/default-college.jpg'} 
                    alt={college.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 
                             transition-transform duration-500"
                />
                {college.is_featured && (
                    <span className="absolute top-4 right-4 bg-yellow-400 text-xs font-bold 
                                   px-3 py-1.5 rounded-full shadow-sm animate-pulse">
                        Featured
                    </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-4 space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 
                             transition-colors duration-200 line-clamp-1">
                    {college.name}
                </h3>
                
                <div className="space-y-2">
                    <div className="flex items-center text-gray-600 hover:text-gray-800 
                                  transition-colors duration-200">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">{college.city}, {college.state}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 hover:text-gray-800 
                                  transition-colors duration-200">
                        <School className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">{college.institution_type}</span>
                    </div>
                    
                    <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-1.5" />
                        <span className="font-medium text-gray-700">{college.rating}</span>
                    </div>
                </div>

                <button
                    onClick={handleViewCollege}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg 
                             hover:bg-indigo-700 active:bg-indigo-800 transform active:scale-97
                             transition-all duration-200 flex items-center justify-center
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <span className="font-medium">View College</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 
                                         transition-transform duration-200" />
                </button>
            </div>
        </div>
    );
};

export default CollegeCard;