import  { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useColleges } from '../services/hooks/useColleges';
import CollegeCard from './CollegeCard';
import CollegeFilter from './CollegeFilter';
import CollegeSearch from './CollegeSearch';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { College } from '../services/types/college.types';

export default function CollegeList() {
    const { colleges, loading, error, fetchColleges, filters } = useColleges();

    useEffect(() => {
        fetchColleges();
    }, [fetchColleges]);

    const filteredColleges = colleges.filter((college: College) => {
        let matches = true;

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            matches = matches && (
                college.name.toLowerCase().includes(searchTerm) ||
                college.location.toLowerCase().includes(searchTerm) ||
                college.affiliation.toLowerCase().includes(searchTerm)
            );
        }

        return matches;
    });

    console.log('Loading state:', loading);
    console.log('Colleges:', colleges);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!colleges.length) {
        return <div>No colleges found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <CollegeSearch />
            <CollegeFilter />
            <motion.div
                className="grid gap-8 lg:grid-cols-2 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {filteredColleges.map((college: College, index: number) => (
                    <CollegeCard key={college.id} college={college} index={index} />
                ))}
                {filteredColleges.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                        No colleges found matching your criteria
                    </div>
                )}
            </motion.div>
        </div>
    );
}