import React from 'react';
import { motion } from 'framer-motion';
import { Program } from '../../../types/question-papers/question-papers.types';
import { BookOpen, ArrowRight, Clock, GraduationCap } from 'lucide-react';

/**
 * Props for the ProgramCard component
 * Extends Program type but omits unused fields
 */
interface ProgramCardProps extends Omit<Program, 'slug' | 'is_active'> {
    isSelected: boolean;
    onSelect: (id: number) => void;
    totalSemesters?: number;
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
 * @param props.isSelected - Whether the program is currently selected
 * @param props.onSelect - Callback when program is selected
 * @param props.totalSemesters - Total number of semesters in the program
 */
const ProgramCard: React.FC<ProgramCardProps> = ({
    id,
    name,
    description,
    duration_years,
    isSelected,
    onSelect,
    totalSemesters = duration_years * 2,
}) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            onSelect(id);
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelect(id)}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            className={`
                group relative overflow-hidden rounded-xl p-6 cursor-pointer
                transition-all duration-300 ease-out min-h-[280px] w-full
                ${isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30'
                    : 'bg-white hover:bg-gradient-to-br hover:from-indigo-50/90 hover:via-purple-50/90 hover:to-indigo-50/90 shadow-lg hover:shadow-indigo-500/10'
                }
            `}
        >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 -mr-10 -mt-10 bg-indigo-400/10 rounded-full blur-2xl group-hover:bg-indigo-400/20 transition-colors duration-300" />
            <div className="absolute bottom-0 left-0 w-56 h-56 -ml-20 -mb-20 bg-purple-400/10 rounded-full blur-2xl group-hover:bg-purple-400/20 transition-colors duration-300" />

            {/* Card Content */}
            <div className="relative flex flex-col h-full gap-6">
                {/* Header Section */}
                <div className="flex gap-5">
                    {/* Program Icon */}
                    <div className={`
                        flex-shrink-0 w-16 h-16 rounded-xl
                        flex items-center justify-center
                        transition-all duration-300
                        ${isSelected 
                            ? 'bg-white/20 text-white' 
                            : 'bg-indigo-100/50 text-indigo-600 group-hover:bg-indigo-100'
                        }
                    `}>
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    
                    {/* Program Title */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`
                            text-2xl font-bold leading-tight mb-2
                            ${isSelected ? 'text-white' : 'text-gray-900'}
                        `}>
                            {name}
                        </h3>
                    </div>
                </div>

                {/* Program Description */}
                <p className={`
                    text-base line-clamp-3 min-h-[4.5em]
                    ${isSelected ? 'text-white/90' : 'text-gray-600'}
                `}>
                    {description || 'No description available'}
                </p>

                {/* Program Stats */}
                <div className="grid grid-cols-2 gap-4 mt-auto">
                    {/* Duration */}
                    <div className={`
                        flex items-center gap-3 p-3 rounded-lg
                        ${isSelected ? 'bg-white/10' : 'bg-indigo-50/50'}
                    `}>
                        <Clock className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-indigo-700'}`}>
                            {duration_years} Years Duration
                        </span>
                    </div>

                    {/* Semesters */}
                    <div className={`
                        flex items-center gap-3 p-3 rounded-lg
                        ${isSelected ? 'bg-white/10' : 'bg-indigo-50/50'}
                    `}>
                        <BookOpen className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-indigo-700'}`}>
                            {totalSemesters} Total Semesters
                        </span>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center justify-end pt-4 border-t border-current/10">
                    {/* View Button */}
                    <motion.button 
                        className={`
                            inline-flex items-center gap-2.5 font-semibold text-base
                            px-5 py-2.5 rounded-lg transition-all duration-300
                            ${isSelected 
                                ? 'bg-white/20 hover:bg-white/30 text-white' 
                                : 'bg-indigo-100/50 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-700'
                            }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        View Program Details
                        <ArrowRight className={`
                            w-5 h-5 transition-transform duration-300
                            ${isSelected ? 'translate-x-0.5 group-hover:translate-x-1.5' : 'group-hover:translate-x-1'}
                        `} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProgramCard; 