/**
 * College Explorer Page Component
 * 
 * A comprehensive college search and filter interface that provides an interactive
 * way to explore educational institutions. Features include:
 * - Real-time search with debouncing
 * - Advanced filtering options
 * - Animated UI elements
 * - Scroll position persistence
 * - Responsive design
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { CollegeGrid } from "../../components/college/CollegeGrid";
import { CollegeFilters } from "../../components/college/CollegeFilters";
import { motion, AnimationProps } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  GraduationCap,
  Building2,
  Users,
  MapPin,
  Star,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import debounce from "lodash/debounce";
import { CollegeFilters as CollegeFiltersType } from "../../types/colleges/college.types";

/**
 * Props interface for the FloatingIcon component
 * Defines the required properties for creating animated floating icons
 */
interface FloatingIconProps {
  Icon: LucideIcon;          // The icon component to be rendered
  className?: string;        // Optional CSS classes
  size?: string;            // Optional size override
  animate: AnimationProps["animate"];       // Framer-motion animation props
  transition: AnimationProps["transition"]; // Framer-motion transition props
}

/**
 * FloatingIcon Component
 * Renders an animated icon with customizable motion effects and styling
 */
const FloatingIcon = ({
  Icon,
  className,
  size = "100%",
  animate,
  transition,
}: FloatingIconProps) => (
  <motion.div className={className} animate={animate} transition={transition}>
    <div
      className={`${className} text-indigo-600/20 drop-shadow-lg filter blur-[0.5px]`}
    >
      <Icon size={size} />
    </div>
  </motion.div>
);

export default function CollegePage() {
  // State Management
  const [filters, setFilters] = useState<CollegeFiltersType>({
    search: "",
    location: undefined,
    programs: [],
    admission_status: undefined,
    rating_min: 0,
    facilities: [],
    showFeatured: false,
    showFavorites: false,
    sortBy: "rating",
    sortOrder: "desc",
  });

  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Scroll Position Management
   * Preserves and restores scroll position when navigating away and returning
   * to the college list page
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('collegeListScrollPos', window.scrollY.toString());
    };

    const savedPosition = sessionStorage.getItem('collegeListScrollPos');
    if (savedPosition !== null) {
      window.scrollTo(0, parseInt(savedPosition));
      sessionStorage.removeItem('collegeListScrollPos');
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  /**
   * Search Debouncing Implementation
   * Prevents excessive filter updates during rapid typing by debouncing the search
   * operation with a 300ms delay
   */
  const debouncedSearch = useCallback(
    (value: string) => {
      setFilters(prev => ({
        ...prev,
        search: value.trim(),
      }));
      setIsSearching(false);
    },
    [setFilters, setIsSearching]
  );

  const debouncedSearchWithDelay = useMemo(
    () => debounce(debouncedSearch, 300),
    [debouncedSearch]
  );

  // Cleanup debounced search on component unmount
  useEffect(() => {
    return () => {
      debouncedSearchWithDelay.cancel();
    };
  }, [debouncedSearchWithDelay]);

  /**
   * Shine Effect Styles
   * Adds global CSS for the search bar shine animation effect
   * The effect is triggered when the search input is focused
   */
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes shine {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(100%);
        }
      }
      .shine-effect {
        overflow: hidden;
      }
      .shine-effect::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 200%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        transform: translateX(-100%);
      }
      .group:focus-within .shine-effect::after {
        animation: shine 2s infinite;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  /**
   * Search Input Handler
   * Manages the search input state and triggers debounced search
   * Provides immediate feedback for empty searches
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue);
    
    debouncedSearchWithDelay.cancel();
    
    if (!newValue.trim()) {
      setIsSearching(false);
      setFilters(prev => ({
        ...prev,
        search: "",
      }));
      return;
    }
    
    setIsSearching(true);
    debouncedSearchWithDelay(newValue);
  };

  /**
   * Filter Change Handler
   * Updates filter state while preserving the search term
   * Memoized to prevent unnecessary re-renders
   */
  const handleFilterChange = useCallback((newFilters: CollegeFiltersType) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      search: prev.search
    }));
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white overflow-hidden font-poppins">
      {/* 
       * Background Effects Container
       * Houses all decorative background elements including gradients,
       * animated waves, and floating icons
       */}
      <div className="absolute inset-0 z-0">
        {/* 
         * Layered Background Effects
         * Creates depth through multiple overlapping gradients and patterns
         */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_10%,transparent_70%)] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5" />

        {/* 
         * Animated Background Wave
         * Provides subtle movement in the background through scale and rotation
         */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute top-1/3 left-0 w-full h-40 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-3xl opacity-20" />
          <div className="absolute top-2/3 -left-1/3 w-[166%] h-32 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-3xl opacity-20" />
        </motion.div>

        {/* 
         * Shimmering Effect
         * Adds a subtle moving gradient overlay for visual interest
         */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundSize: "200% 200%",
            backgroundImage:
              "linear-gradient(45deg, transparent 0%, transparent 45%, rgba(255,255,255,0.15) 50%, transparent 55%, transparent 100%)",
          }}
        />

        {/* Grid Pattern - Adds texture to the background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.1]" />

        {/* 
         * Floating Icons Section
         * Animated decorative icons that float around the page
         * Each icon has unique animation parameters for natural movement
         */}
        <FloatingIcon
          Icon={Building2}
          className="absolute h-24 w-24 right-[15%] top-[8%] z-10"
          size="100%"
          animate={{ y: [0, -50, 0], x: [0, 40, 0], rotate: [0, 12, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <FloatingIcon
          Icon={GraduationCap}
          className="absolute h-24 w-24 left-[20%] top-[10%] z-10"
          size="100%"
          animate={{ y: [0, 50, 0], x: [0, -40, 0], rotate: [0, -12, 12, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <FloatingIcon
          Icon={Star}
          className="absolute h-24 w-24 right-[20%] bottom-[8%] z-10"
          size="100%"
          animate={{ y: [0, -40, 0], x: [0, -30, 0], rotate: [0, 6, -6, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <FloatingIcon
          Icon={BookOpen}
          className="absolute h-24 w-24 left-[15%] bottom-[10%] z-10"
          size="100%"
          animate={{ y: [0, 45, 0], x: [0, 30, 0], rotate: [0, -10, 10, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        <FloatingIcon
          Icon={MapPin}
          className="absolute h-24 w-24 right-[5%] top-[40%] z-10"
          size="100%"
          animate={{ y: [0, -45, 0], x: [0, 25, 0], rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <FloatingIcon
          Icon={Users}
          className="absolute h-24 w-24 left-[15%] bottom-[10%] z-10"
          size="100%"
          animate={{ y: [0, 45, 0], x: [0, 30, 0], rotate: [0, -10, 10, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
      </div>

      {/* 
       * Main Content Container
       * Contains the actual college explorer interface components
       */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 z-20 flex flex-col items-center min-h-screen">
        {/* 
         * Header Section
         * Animated entrance with title and description
         */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4 py-2.5 drop-shadow-sm">
            College Explorer
          </h1>
          <p className="text-lg sm:text-xl text-gray-700/90 max-w-2xl mx-auto">
            Find your perfect college and explore educational opportunities
          </p>
        </motion.div>

        {/* 
         * Search Bar Section
         * Features an animated search input with glow effects and loading state
         */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-3xl sm:max-w-4xl mb-10"
        >
          <motion.div
            whileHover={{ scale: 1.015 }}
            className="relative group transition-all duration-300"
          >
            {/* Interactive glow effects */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 group-focus-within:opacity-30 transition-all duration-300 blur-lg z-0" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-400/30 via-blue-500/30 to-indigo-400/30 rounded-full opacity-30 blur-md z-0 transition-all duration-300" />

            {/* Search input field */}
            <input
              type="text"
              placeholder="Search colleges by name, location, or programs..."
              value={searchInput}
              onChange={handleSearchChange}
              className="relative z-10 w-full pl-6 pr-14 py-3.5 rounded-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md border border-gray-200/60 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 focus:outline-none transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-lg hover:bg-white/90 hover:backdrop-blur-lg placeholder:text-gray-400 text-gray-800 text-base"
            />

            {/* 
             * Search Icon with Loading Animation
             * Displays a loading animation when search is in progress
             */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
              <motion.button
                type="button"
                className="p-2 rounded-full bg-indigo-50 text-indigo-900 transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-950 hover:shadow-[0_0_12px_rgba(75,0,130,0.4)] flex items-center justify-center origin-center"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <motion.div
                    animate={
                      isSearching
                        ? {
                            x: [0, 3, 0, -3, 0],
                            y: [0, 0, 3, 0, -3],
                          }
                        : { x: 0, y: 0 }
                    }
                    transition={
                      isSearching
                        ? {
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "linear",
                            times: [0, 0.25, 0.5, 0.75, 1]
                          }
                        : { duration: 0.3 }
                    }
                    className="flex items-center justify-center"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 pointer-events-none text-indigo-600 z-10" />
                  </motion.div>

                  {/* Loading spinner animation */}
                  {isSearching && (
                    <motion.div
                      className="absolute -inset-1 rounded-full border-2 border-transparent border-t-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                      initial={{ rotateZ: 0 }}
                      animate={{ rotateZ: 360 }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  )}
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* 
         * Filters Section
         * Contains advanced filtering options for college search
         */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="w-full max-w-7xl mb-8"
        >
          <CollegeFilters onFilterChange={handleFilterChange} />
        </motion.div>

        {/* 
         * College Grid Section
         * Displays the filtered college results in a responsive grid layout
         */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-full max-w-7xl"
        >
          <CollegeGrid
            search={filters.search}
            location={filters.location}
            programs={filters.programs}
            admission_status={filters.admission_status}
            rating_min={filters.rating_min}
            facilities={filters.facilities}
            showFeatured={filters.showFeatured}
            showFavorites={filters.showFavorites}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
          />
        </motion.div>
      </div>
    </div>
  );
} 