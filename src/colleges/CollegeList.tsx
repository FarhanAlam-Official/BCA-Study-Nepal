import { useState, useEffect } from 'react';
import { useColleges } from '../services/hooks/useColleges';
import type { College, CollegeFilters } from '../services/types/college.types';
import { motion, AnimatePresence } from 'framer-motion';
import CollegeFilter from './CollegeFilter';
import CollegeSearch from './CollegeSearch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { School, X, SlidersHorizontal } from 'lucide-react';
import CollegeCard from './CollegeCard';

export default function CollegeList() {
    const [filters, setFilters] = useState<CollegeFilters>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
    const { colleges = [], loading, error } = useColleges(filters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        if (!Array.isArray(colleges)) return;
        
        let result = [...colleges];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(college => 
                college.name.toLowerCase().includes(query) ||
                college.location.toLowerCase().includes(query) ||
                college.courses_offered?.some(course => 
                    course.toLowerCase().includes(query)
                )
            );
        }

        setFilteredColleges(result);
    }, [colleges, searchQuery]);

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <LoadingSpinner size="large" />
        </div>
    );

    if (error) return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600"
        >
            Error: {error}
        </motion.div>
    );

    const uniqueCities = Array.isArray(colleges) 
        ? [...new Set(colleges.map(c => c.city))].filter(Boolean)
        : [];
    const uniqueAffiliations = Array.isArray(colleges)
        ? [...new Set(colleges.map(c => c.affiliation))].filter(Boolean)
        : [];

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div className="space-y-8">
                {/* Centered Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Explore Colleges
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover and compare top colleges to find your perfect educational fit. 
                        Use filters to narrow down your options based on your preferences.
                    </p>
                </div>

                {/* Search and Filter Section - Centered */}
                <div className="flex items-center gap-4 justify-center max-w-3xl mx-auto">
                    <div className="flex-1">
                        <CollegeSearch onSearch={setSearchQuery} />
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-50 
                                 text-indigo-600 hover:bg-indigo-100 transition-colors duration-200
                                 whitespace-nowrap"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                    {Object.keys(filters).length > 0 && (
                        <button
                            onClick={() => setFilters({})}
                            className="text-sm text-indigo-600 hover:text-indigo-700
                                     px-3 py-2 rounded-lg hover:bg-indigo-50
                                     transition-colors duration-200"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* College Grid */}
                <AnimatePresence mode="wait">
                    {filteredColleges.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-gray-50 rounded-xl p-12 text-center"
                        >
                            <School className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No colleges found
                            </h3>
                            <p className="text-gray-600">
                                Try adjusting your filters or search criteria
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredColleges.map((college, index) => (
                                <motion.div
                                    key={college.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ 
                                        opacity: 1, 
                                        y: 0,
                                        transition: { delay: index * 0.1 }
                                    }}
                                >
                                    <CollegeCard  college={college} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Filter Panel - Transparent Background */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsFilterOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed right-4 top-4 h-[calc(100vh-32px)] w-full max-w-xs 
                                    backdrop-blur-sm shadow-2xl rounded-2xl p-5 
                                     overflow-y-auto z-50"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                <div className="flex items-center gap-2">
                                    {Object.keys(filters).length > 0 && (
                                        <button
                                            onClick={() => {
                                                setFilters({});
                                            }}
                                            className="text-sm text-indigo-600 hover:text-indigo-700
                                                     px-3 py-1.5 rounded-lg hover:bg-indigo-50
                                                     transition-colors duration-200"
                                        >
                                            Reset
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="p-2 hover:bg-indigo-100/50 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <CollegeFilter
                                onFilterChange={setFilters}
                                cities={uniqueCities}
                                affiliations={uniqueAffiliations}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}