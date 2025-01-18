import React from 'react';
import { BookOpen, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Note } from '../../services/types';

interface SemesterGridProps {
    notes: Note[];
    groupedNotes: { [key: string]: Note[] };
    onSemesterClick: (semester: string) => void;
}

const SemesterGrid: React.FC<SemesterGridProps> = ({ notes, groupedNotes, onSemesterClick }) => {
    const semesters = ["all", ...Array.from({ length: 8 }, (_, i) => (i + 1).toString())];

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {semesters.map((semester) => {
                const semesterData = semester === "all" ? notes : groupedNotes[semester] || [];
                const isNumericSemester = semester !== "all";
                const semesterNumber = isNumericSemester ? parseInt(semester) : 0;

                return (
                    <motion.div
                        key={semester}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => onSemesterClick(semester)}
                        className={`
                            group relative overflow-hidden rounded-xl aspect-square cursor-pointer
                            transition-all duration-300 ease-out
                            bg-white/80 hover:bg-gradient-to-br hover:from-indigo-50/90 hover:via-purple-50/90 hover:to-indigo-50/90 
                            shadow-lg hover:shadow-indigo-500/10
                        `}
                    >
                        <div className="h-full flex flex-col p-5">
                            {/* Top Section */}
                            <div className="mb-6">
                                <div className="p-3 rounded-xl w-fit bg-indigo-100/50 text-indigo-600 group-hover:bg-indigo-100">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Middle Section */}
                            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {isNumericSemester ? (
                                        <>
                                            {semesterNumber}
                                            <sup className="text-lg font-medium">
                                                {getOrdinalSuffix(semesterNumber)}
                                            </sup>
                                            {' '}Semester
                                        </>
                                    ) : (
                                        "All Semesters"
                                    )}
                                </h3>

                                <div className="flex flex-col items-center space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600">
                                        <FileText className="w-4 h-4" />
                                        <span>Notes</span>
                                    </div>

                                    <div className="px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-200/70 text-indigo-700 group-hover:bg-indigo-200">
                                        {semesterData.length} {semesterData.length === 1 ? 'Note' : 'Notes'}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="mt-6">
                                <motion.div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-indigo-50/70 group-hover:bg-indigo-100/80">
                                    <span className="text-sm font-medium text-indigo-600">
                                        View Notes
                                    </span>
                                    <BookOpen className="w-4 h-4 text-indigo-600 transition-transform duration-300 group-hover:translate-x-1" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Pattern overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-indigo-50 to-transparent group-hover:opacity-20" />
                    </motion.div>
                );
            })}
        </div>
    );
};

// Helper function for ordinal suffixes
const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
};

export default SemesterGrid;