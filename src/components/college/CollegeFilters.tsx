import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPinIcon,
  AcademicCapIcon,
  StarIcon,
  SparklesIcon,
  HeartIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { ArrowDownUp, ArrowDown, ArrowUp } from 'lucide-react';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { collegeApi } from './collegeApi';
import { CollegeFilters as CollegeFiltersType } from './college';
import { Combobox } from '@headlessui/react';

interface CollegeFiltersProps {
  onFilterChange: (filters: CollegeFiltersType) => void;
}

type SortOption = {
  value: string;
  label: string;
  sortBy: 'rating' | 'established_year' | 'view_count' | 'name';
};

const sortOptions: SortOption[] = [
  { value: 'rating', label: 'Rating', sortBy: 'rating' },
  { value: 'popular', label: 'Popularity', sortBy: 'view_count' },
  { value: 'year', label: 'Year', sortBy: 'established_year' },
  { value: 'name', label: 'Name', sortBy: 'name' },
];

export const CollegeFilters = ({ onFilterChange }: CollegeFiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [programs, setPrograms] = useState<string[]>([]);
  const [programQuery, setProgramQuery] = useState('');
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>();
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedAdmissionStatus, setSelectedAdmissionStatus] = useState<string>();
  const [ratingMin, setRatingMin] = useState<number>(0);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortOptions[0]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [locationsData, programsData] = await Promise.all([
          collegeApi.getLocations(),
          collegeApi.getPrograms(),
        ]);
        setLocations(locationsData);
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Update filters when any selection changes
  useEffect(() => {
    onFilterChange({
      location: selectedLocation,
      programs: selectedPrograms,
      admission_status: selectedAdmissionStatus,
      rating_min: ratingMin,
      showFeatured,
      showFavorites,
      sortBy: selectedSort.sortBy,
      sortOrder,
    });
  }, [
    selectedLocation,
    selectedPrograms,
    selectedAdmissionStatus,
    ratingMin,
    showFeatured,
    showFavorites,
    selectedSort,
    sortOrder,
    onFilterChange
  ]);

  const clearAllFilters = () => {
    setSelectedLocation(undefined);
    setSelectedPrograms([]);
    setSelectedAdmissionStatus(undefined);
    setRatingMin(0);
    setShowFeatured(false);
    setShowFavorites(false);
    setSelectedSort(sortOptions[0]);
    setSortOrder('desc');
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 w-full max-w-6xl mx-auto"
    >
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Sort Button with Dropdown */}
        <div className="relative flex items-center gap-1">
          <motion.button
            onMouseEnter={() => setIsHovered('sort')}
            onMouseLeave={() => setIsHovered(null)}
            onClick={() => setShowSortOptions(!showSortOptions)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-indigo-100/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/3 to-purple-500/3 transition-opacity duration-300 group-hover:opacity-50" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-indigo-100/20" />
            <motion.div
              initial={false}
              animate={{ opacity: isHovered === 'sort' ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur opacity-0"
            />
            
            {/* Button Content */}
            <div className="relative px-6 py-2.5 flex items-center gap-2">
              <ArrowDownUp className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">
                {selectedSort.label}
              </span>
            </div>
          </motion.button>

          {/* Sort Order Toggle */}
          <div className="relative group">
            <motion.button
              onMouseEnter={() => setIsHovered('order')}
              onMouseLeave={() => setIsHovered(null)}
              onClick={toggleSortOrder}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-indigo-100/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 p-2"
            >
              {/* Decorative Elements */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/3 to-purple-500/3 transition-opacity duration-300 group-hover:opacity-50" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-indigo-100/20" />
              <motion.div
                initial={false}
                animate={{ opacity: isHovered === 'order' ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur opacity-0"
              />
              
              {/* Button Content */}
              <div className="relative">
                {sortOrder === 'asc' ? (
                  <ArrowUp className="w-4 h-4 text-indigo-600" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-indigo-600" />
                )}
              </div>
            </motion.button>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </div>
          </div>

          {/* Sort Options Dropdown */}
          <AnimatePresence>
            {showSortOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 z-50 mt-2 w-48 top-full rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="py-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedSort(option);
                        setShowSortOptions(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150
                        ${selectedSort.value === option.value 
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onMouseEnter={() => setIsHovered('favorites')}
          onMouseLeave={() => setIsHovered(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFavorites(!showFavorites)}
          className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-indigo-100/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/3 to-purple-500/3 transition-opacity duration-300 group-hover:opacity-50" />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-indigo-100/20" />
          <motion.div
            initial={false}
            animate={{ opacity: isHovered === 'favorites' ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur opacity-0"
          />
          
          {/* Button Content */}
          <div className="relative px-6 py-2.5 flex items-center gap-2">
            {showFavorites ? (
              <HeartIconSolid className="w-4 h-4 text-red-500 transition-transform group-hover:scale-110 duration-300" />
            ) : (
              <HeartIcon className="w-4 h-4 text-gray-400 transition-transform group-hover:scale-110 duration-300 group-hover:text-red-500" />
            )}
            <span className={`text-sm font-medium transition-colors duration-300 ${
              showFavorites ? 'text-red-600' : 'text-gray-700 group-hover:text-red-600'
            }`}>
              Favorites
            </span>
          </div>
        </motion.button>

        <motion.button
          onMouseEnter={() => setIsHovered('featured')}
          onMouseLeave={() => setIsHovered(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFeatured(!showFeatured)}
          className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-indigo-100/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/3 to-purple-500/3 transition-opacity duration-300 group-hover:opacity-50" />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-indigo-100/20" />
          <motion.div
            initial={false}
            animate={{ opacity: isHovered === 'featured' ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur opacity-0"
          />
          
          {/* Button Content */}
          <div className="relative px-6 py-2.5 flex items-center gap-2">
            <SparklesIcon className={`w-4 h-4 transition-all duration-500 ${
              showFeatured ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
            } ${showFeatured ? 'animate-pulse' : 'group-hover:animate-pulse'}`} />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              showFeatured ? 'text-indigo-600' : 'text-gray-700 group-hover:text-indigo-600'
            }`}>
              Featured
            </span>
          </div>
        </motion.button>

        <motion.button
          onMouseEnter={() => setIsHovered('filters')}
          onMouseLeave={() => setIsHovered(null)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-indigo-100/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/3 to-purple-500/3 transition-opacity duration-300 group-hover:opacity-50" />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-indigo-100/20" />
          <motion.div
            initial={false}
            animate={{ opacity: isHovered === 'filters' ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur opacity-0"
          />
          
          {/* Button Content */}
          <div className="relative px-6 py-2.5 flex items-center gap-2">
            <FunnelIcon className={`w-4 h-4 transition-colors duration-300 ${
              showAdvancedFilters || selectedLocation || selectedPrograms.length > 0 || selectedAdmissionStatus || ratingMin > 0
                ? 'text-indigo-600'
                : 'text-gray-400 group-hover:text-indigo-600'
            }`} />
            <span className={`text-sm font-medium transition-colors duration-300 ${
              showAdvancedFilters || selectedLocation || selectedPrograms.length > 0 || selectedAdmissionStatus || ratingMin > 0
                ? 'text-indigo-600'
                : 'text-gray-700 group-hover:text-indigo-600'
            }`}>
              Filters
            </span>
            {(selectedLocation || selectedPrograms.length > 0 || selectedAdmissionStatus || ratingMin > 0) && (
              <span className="ml-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
                {[
                  selectedLocation && 1,
                  selectedPrograms.length > 0 && 1,
                  selectedAdmissionStatus && 1,
                  ratingMin > 0 && 1
                ].filter(Boolean).length}
              </span>
            )}
          </div>
        </motion.button>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-indigo-100/20 overflow-hidden max-w-6xl mx-auto"
          >
            {/* Decorative Elements */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/3 to-purple-500/3" />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-indigo-100/20" />
            
            {/* Content */}
            <div className="relative p-6">
              <div className="grid grid-cols-8 gap-6">
                {/* Quick Filters Row */}
                <div className="col-span-8 flex flex-wrap items-center gap-3 pb-6 border-b border-gray-100">
                  <button
                    onClick={() => setSelectedAdmissionStatus(selectedAdmissionStatus === 'OPEN' ? undefined : 'OPEN')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedAdmissionStatus === 'OPEN'
                        ? 'bg-green-50 text-green-600 ring-1 ring-green-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => setSelectedAdmissionStatus(selectedAdmissionStatus === 'COMING_SOON' ? undefined : 'COMING_SOON')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedAdmissionStatus === 'COMING_SOON'
                        ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setSelectedAdmissionStatus(selectedAdmissionStatus === 'CLOSED' ? undefined : 'CLOSED')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedAdmissionStatus === 'CLOSED'
                        ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    Closed
                  </button>
                </div>

                {/* Location Filter */}
                <div className="col-span-3 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <MapPinIcon className="w-4 h-4 text-indigo-400" />
                    Location
                  </label>
                  <select
                    value={selectedLocation || ''}
                    onChange={(e) => setSelectedLocation(e.target.value || undefined)}
                    className="w-full h-10 px-3 rounded-lg border-gray-200 bg-white/80 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 cursor-pointer hover:bg-gray-50"
                  >
                    <option value="">All Locations</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Programs Filter */}
                <div className="col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <AcademicCapIcon className="w-4 h-4 text-indigo-400" />
                    Programs
                  </label>
                  <Combobox value={selectedPrograms} onChange={setSelectedPrograms} multiple>
                    <div className="relative">
                      <Combobox.Input
                        className="w-full h-11 px-3 rounded-lg border-gray-200 bg-white/80 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 hover:bg-gray-50"
                        onChange={(event) => setProgramQuery(event.target.value)}
                        placeholder="Search programs..."
                        displayValue={(selected: string[]) => selected.join(', ')}
                      />
                      <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {programs
                          .filter((program) =>
                            program.toLowerCase().includes(programQuery.toLowerCase())
                          )
                          .map((program) => (
                            <Combobox.Option
                              key={program}
                              value={program}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2.5 px-4 ${
                                  active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                                }`
                              }
                            >
                              {({ selected }) => (
                                <div className="flex items-center">
                                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                    {program}
                                  </span>
                                  {selected && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              )}
                            </Combobox.Option>
                          ))}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                  {selectedPrograms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedPrograms.map((program) => (
                        <span
                          key={program}
                          className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 transition-all duration-200 hover:bg-indigo-100"
                        >
                          {program}
                          <button
                            type="button"
                            onClick={() => setSelectedPrograms(selectedPrograms.filter(p => p !== program))}
                            className="ml-1.5 hover:bg-indigo-200 rounded-full p-0.5 transition-all duration-200"
                          >
                            <span className="sr-only">Remove</span>
                            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rating Filter */}
                <div className="col-span-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <StarIcon className="w-4 h-4 text-indigo-400" />
                      Minimum Rating
                    </label>
                    <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-sm font-medium">
                      {ratingMin}
                    </span>
                  </div>
                  <div className="px-1">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={ratingMin}
                      onChange={(e) => setRatingMin(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-sm font-medium text-gray-400 mt-1.5">
                      <span>0</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>

                {/* Clear Filters Button */}
                <div className="col-span-8 flex justify-end pt-3 border-t border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearAllFilters}
                    className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300
                      bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"
                  >
                    Clear All Filters
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 