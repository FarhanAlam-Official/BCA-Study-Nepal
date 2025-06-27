import { Switch } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { CollegeFilters } from '../services/types/college.types';
import { FilterIcon, Star } from 'lucide-react';

interface CollegeFilterProps {
    onFilterChange: (filters: CollegeFilters) => void;
    cities: string[];
    affiliations: string[];
}

export default function CollegeFilter({ onFilterChange, cities, affiliations }: CollegeFilterProps) {
    const [filters, setFilters] = useState<CollegeFilters>({});
    const [isExpanded, setIsExpanded] = useState(true);

    const handleFilterChange = (key: string, value: unknown) => {
        const newFilters = { ...filters, [key]: value };
        if (!value) delete newFilters[key as keyof typeof newFilters];
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300
                      border border-gray-100 hover:shadow-lg">
            {/* Filter Header */}
            <div 
                className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 
                         flex justify-between items-center cursor-pointer
                         hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FilterIcon className="w-5 h-5" />
                    Filters
                </h3>
                <ChevronDown 
                    className={`w-5 h-5 text-white transition-transform duration-300 ${
                        isExpanded ? 'transform rotate-180' : ''
                    }`}
                />
            </div>

            {/* Filter Content */}
            <div className={`transition-all duration-300 ease-in-out
                          ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 space-y-6">
                    {/* Rating Filter */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Minimum Rating
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {[4, 3, 2, 1].map(rating => (
                                <button
                                    key={rating}
                                    onClick={() => handleFilterChange('rating_gte', rating)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium 
                                             transition-all duration-200 transform hover:scale-105
                                             focus:outline-none focus:ring-2 focus:ring-offset-2
                                             ${filters.rating === rating
                                        ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus:ring-indigo-500'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400'
                                    }`}
                                >
                                    {rating}+ <Star className="w-4 h-4 inline ml-1 text-yellow-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* City Filter */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <select
                            onChange={(e) => handleFilterChange('city', e.target.value)}
                            className="w-full rounded-lg border-gray-200 bg-gray-50 py-2.5
                                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                   hover:border-indigo-300 transition-all duration-200"
                            defaultValue=""
                        >
                            <option value="">All Cities</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Affiliation Filter */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Affiliation
                        </label>
                        <select
                            onChange={(e) => handleFilterChange('affiliation', e.target.value)}
                            className="w-full rounded-lg border-gray-200 bg-gray-50 py-2.5
                                   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                   hover:border-indigo-300 transition-all duration-200"
                            defaultValue=""
                        >
                            <option value="">All Affiliations</option>
                            {affiliations.map(affiliation => (
                                <option key={affiliation} value={affiliation}>{affiliation}</option>
                            ))}
                        </select>
                    </div>

                    {/* Featured Toggle - Enhanced version */}
                    <div className={`flex items-center justify-between p-4 rounded-lg
                                    transition-all duration-200 ${
                                        filters.is_featured 
                                        ? 'bg-indigo-50 border-2 border-indigo-200' 
                                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                    }`}>
                        <div className="flex items-center gap-2">
                            <Star className={`w-5 h-5 ${
                                filters.is_featured ? 'text-indigo-500' : 'text-gray-400'
                            }`} />
                            <label className={`text-sm font-medium cursor-pointer ${
                                filters.is_featured ? 'text-indigo-700' : 'text-gray-700'
                            }`}>
                                Featured Only
                            </label>
                        </div>
                        <Switch
                            checked={!!filters.is_featured}
                            onChange={(checked) => handleFilterChange('is_featured', checked)}
                            className={`${
                                filters.is_featured 
                                    ? 'bg-indigo-600' 
                                    : 'bg-gray-300'
                            } relative inline-flex h-7 w-14 items-center rounded-full
                               transition-colors duration-300 ease-in-out cursor-pointer
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                            <span 
                                aria-hidden="true"
                                className={`${
                                    filters.is_featured 
                                        ? 'translate-x-8' 
                                        : 'translate-x-1'
                                } pointer-events-none inline-block h-5 w-5 transform rounded-full 
                                   bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out
                                   ${filters.is_featured 
                                       ? 'motion-safe:animate-toggleOn' 
                                       : 'motion-safe:animate-toggleOff'}`}
                            />
                        </Switch>
                    </div>

                    {/* Clear Filters */}
                    {Object.keys(filters).length > 0 && (
                        <button
                            onClick={() => {
                                setFilters({});
                                onFilterChange({});
                            }}
                            className="w-full mt-4 px-4 py-2.5 text-sm font-medium text-indigo-600 
                                   rounded-lg border border-indigo-200 hover:bg-indigo-50 
                                   transition-all duration-200 transform hover:scale-[1.02]
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                   focus:ring-offset-2 active:scale-[0.98]"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}