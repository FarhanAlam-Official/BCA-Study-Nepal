import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CollegeSearch({ onSearch }: { onSearch: (query: string) => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-2xl mx-auto"
        >
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search colleges by name, location, or courses..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-blue-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm hover:shadow-md transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
        </motion.div>
    );
}