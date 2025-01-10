// import React from 'react';
import { Search } from 'lucide-react';
import { useColleges } from '../services/hooks/useColleges';
import { motion } from 'framer-motion';

export default function CollegeSearch() {
    const { filters, setFilters } = useColleges();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
        >
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search colleges by name, location, or affiliation..."
                    value={filters.search || ''}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                />
            </div>
        </motion.div>
    );
}