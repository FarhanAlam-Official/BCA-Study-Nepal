import { useState, useEffect, useCallback, useMemo } from "react";
import { CollegeGrid } from "../components/college/CollegeGrid";
import { CollegeFilters } from "../components/college/CollegeFilters";
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
import { CollegeFilters as CollegeFiltersType } from "../components/college/college";

interface FloatingIconProps {
  Icon: LucideIcon;
  className?: string;
  size?: string;
  animate: AnimationProps["animate"];
  transition: AnimationProps["transition"];
}

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

  // Debounced search function
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

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearchWithDelay.cancel();
    };
  }, [debouncedSearchWithDelay]);

  // Add global styles for shine effect
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue);
    
    // Cancel any pending debounced searches
    debouncedSearchWithDelay.cancel();
    
    // If search is cleared, update immediately
    if (!newValue.trim()) {
      setIsSearching(false);
      setFilters(prev => ({
        ...prev,
        search: "",
      }));
      return;
    }
    
    // Only show loading state and trigger search if there's actual input
    setIsSearching(true);
    console.log('Searching for:', newValue);
    debouncedSearchWithDelay(newValue);
  };

  // Stabilize handleFilterChange with useCallback
  const handleFilterChange = useCallback((newFilters: CollegeFiltersType) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Preserve search from previous state since it's managed separately
      search: prev.search
    }));
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white overflow-hidden font-poppins">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_10%,transparent_70%)] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5" />

        {/* Animated Background Wave */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute top-1/3 left-0 w-full h-40 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-3xl opacity-20" />
          <div className="absolute top-2/3 -left-1/3 w-[166%] h-32 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-3xl opacity-20" />
        </motion.div>

        {/* Shimmering Effect */}
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

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.1]" />

        {/* Floating Icons */}
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

      {/* Main Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 z-20 flex flex-col items-center min-h-screen">
        {/* Header Section */}
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

        {/* Search Bar */}
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
            {/* Glow ring */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 group-focus-within:opacity-30 transition-all duration-300 blur-lg z-0" />

            {/* Subtle ambient glow */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-400/30 via-blue-500/30 to-indigo-400/30 rounded-full opacity-30 blur-md z-0 transition-all duration-300" />

            {/* Input field */}
            <input
              type="text"
              placeholder="Search colleges by name, location, or programs..."
              value={searchInput}
              onChange={handleSearchChange}
              className="relative z-10 w-full pl-6 pr-14 py-3.5 rounded-full bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md border border-gray-200/60 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 focus:outline-none transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-lg hover:bg-white/90 hover:backdrop-blur-lg placeholder:text-gray-400 text-gray-800 text-base"
            />

            {/* Search Icon */}
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="w-full max-w-7xl mb-8"
        >
          <CollegeFilters onFilterChange={handleFilterChange} />
        </motion.div>

        {/* College Grid */}
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