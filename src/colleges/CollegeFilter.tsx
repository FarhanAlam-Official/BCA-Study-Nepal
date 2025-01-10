// import React from 'react';
import { motion } from 'framer-motion';
// import { Star } from 'lucide-react';
import { useColleges } from '../services/hooks/useColleges';

export default function CollegeFilter() {
  const { filters, setFilters } = useColleges();

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' },
  ];

  const affiliationOptions = [
    'All Universities',
    'Pokhara University',
    'Tribhuvan University',
    'Kathmandu University',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg shadow-sm mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <select
            value={filters.rating || 0}
            onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Affiliation Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            University Affiliation
          </label>
          <select
            value={filters.affiliation || 'All Universities'}
            onChange={(e) => setFilters({ ...filters, affiliation: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {affiliationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={() => setFilters({})}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
}