import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Clock, Users } from 'lucide-react';

/**
 * Props for the ProgramCard component
 * Extends Program type but omits unused fields
 */
interface ProgramCardProps {
    id: number;
    name: string;
    description?: string;
    duration_years?: number;
    total_semesters?: number;
    student_count?: number;
    isSelected?: boolean;
    onSelect: (id: number) => void;
}

/**
 * ProgramCard Component
 * Displays program information in an interactive card format
 * Features hover animations, selection state, and rich program details
 * 
 * @param props - Component props
 * @param props.id - Program ID
 * @param props.name - Program name
 * @param props.description - Program description
 * @param props.duration_years - Program duration in years
 * @param props.total_semesters - Total number of semesters in the program
 * @param props.student_count - Number of students in the program
 * @param props.isSelected - Whether the program is currently selected
 * @param props.onSelect - Callback when program is selected
 */
const ProgramCard: React.FC<ProgramCardProps> = ({
    id,
    name,
    description,
    duration_years,
    total_semesters,
    student_count,
    isSelected,
    onSelect,
}) => {
    const handleClick = () => {
        onSelect(id);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            onSelect(id);
        }
    };

    return (
        <motion.button
            whileHover={{ 
                scale: 1.03,
                y: -4,
                transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={`group relative overflow-hidden bg-white h-[280px] rounded-2xl shadow-sm 
                      border border-gray-100 hover:border-indigo-200 hover:shadow-lg
                      transition-all duration-300 ease-out text-left w-full
                      ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-transparent 
                          opacity-0 group-hover:opacity-100 transition-all duration-300" />
            
            {/* Decorative Blur Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-indigo-100/30 
                          rounded-full blur-2xl group-hover:bg-indigo-200/40 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 bg-purple-100/30 
                          rounded-full blur-2xl group-hover:bg-purple-200/40 transition-colors duration-300" />
            
            <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Header with logo and program name */}
                <div className="flex items-center gap-4 mb-6">
                    <motion.div 
                        className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors"
                        whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                        transition={{ duration: 0.5 }}
                    >
                        <GraduationCap className="w-7 h-7 text-indigo-600" />
                    </motion.div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                            {name}
                        </h3>
                        <h4 className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                            Bachelor of {name}
                        </h4>
                    </div>
                </div>

                {/* Program details */}
                <div className="flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-auto group-hover:text-gray-700 transition-colors">
                        {description || `Explore the comprehensive question papers for ${name}`}
                    </p>
                    
                    {/* Program stats with enhanced animations */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <motion.div 
                            className="flex items-center gap-2 text-gray-600"
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Clock className="w-4 h-4 group-hover:text-indigo-600 transition-colors" />
                            <span className="text-sm group-hover:text-gray-700 transition-colors">
                                {duration_years || 4} Years
                            </span>
                        </motion.div>
                        <motion.div 
                            className="flex items-center gap-2 text-gray-600"
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Users className="w-4 h-4 group-hover:text-indigo-600 transition-colors" />
                            <span className="text-sm group-hover:text-gray-700 transition-colors">
                                {total_semesters || 8} Semesters
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-xl" />
        </motion.button>
    );
};

export default ProgramCard; 