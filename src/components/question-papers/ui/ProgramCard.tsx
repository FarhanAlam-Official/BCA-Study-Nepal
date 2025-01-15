import React from 'react';
import { motion } from 'framer-motion';
import { Program } from '../../../services/types/questionpapers.types';
import { BookOpen, ArrowRight } from 'lucide-react';

interface ProgramCardProps extends Omit<Program, 'slug' | 'is_active'> {
    isSelected: boolean;
    onSelect: (id: number) => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
    id,
    name,
    description,
    duration_years,
    isSelected,
    onSelect,
}) => {
    return (
        <motion.div
            whileHover={{ 
                scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelect(id)}
            className={`
                group relative overflow-hidden rounded-xl p-6 cursor-pointer
                transition-all duration-300 ease-out
                ${isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30'
                    : 'bg-white/80 hover:bg-gradient-to-br hover:from-indigo-50/90 hover:via-purple-50/90 hover:to-indigo-50/90 shadow-lg hover:shadow-indigo-500/10'
                }
            `}
        >
            <div className="flex gap-5">
                <div className={`
                    flex-shrink-0 w-12 h-12 rounded-xl
                    flex items-center justify-center
                    transition-all duration-300
                    ${isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-indigo-100/50 text-indigo-600 group-hover:bg-indigo-100'
                    }
                `}>
                    <BookOpen className="w-6 h-6" />
                </div>
                
                <div className="flex-1 min-w-0 space-y-3">
                    <h3 className={`
                        text-lg font-semibold line-clamp-1
                        ${isSelected ? 'text-white' : 'text-gray-900'}
                    `}>
                        {name}
                    </h3>
                    
                    <p className={`
                        text-sm line-clamp-2
                        ${isSelected ? 'text-white/90' : 'text-gray-600'}
                    `}>
                        {description}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className={`
                            px-3 py-1 rounded-full font-medium text-sm
                            transition-colors duration-300
                            ${isSelected 
                                ? 'bg-white/20 text-white' 
                                : 'bg-indigo-100/50 text-indigo-600 group-hover:bg-indigo-100'
                            }
                        `}>
                            {duration_years} Years
                        </span>
                        
                        <motion.span 
                            className={`
                                inline-flex items-center gap-2 font-semibold text-sm
                                ${isSelected 
                                    ? 'text-white' 
                                    : 'text-indigo-600 group-hover:text-indigo-700'
                                }
                            `}
                        >
                            View Subjects
                            <ArrowRight className={`
                                w-4 h-4 transition-transform duration-300
                                ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'}
                            `} />
                        </motion.span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProgramCard; 