/**
 * @file SyllabusList.tsx
 * @description A component that displays a list of syllabus versions for a specific subject
 * with options to view and download PDFs.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Syllabus } from '../../types/syllabus/syllabus.types';
import { syllabusService } from '../../api/syllabus/syllabus.api';
import { FileText, Download, Eye, ArrowLeft, Calendar, BookOpen } from 'lucide-react';
import PDFViewer from '../common/PDFViewer';
import { showError, showSuccess } from '../../utils/notifications';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * SubjectSyllabusList Component
 * Displays a list of syllabus versions for a specific subject with interactive features.
 * 
 * Features:
 * - PDF viewing and downloading capabilities
 * - Version tracking and management
 * - View count tracking
 * - Download count tracking
 * - Error handling and notifications
 * - Loading states
 * - Animated UI elements
 * - Responsive layout
 * 
 * @component
 * @returns {React.ReactElement} Rendered component
 */
const SubjectSyllabusList: React.FC = () => {
    const { subjectId, subjectName } = useParams();
    const navigate = useNavigate();
    const [syllabusList, setSyllabusList] = useState<Syllabus[]>([]);
    const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetches syllabus data for the current subject
     * Handles loading states and error scenarios
     */
    useEffect(() => {
        const fetchSyllabus = async () => {
            if (!subjectId) {
                setError('No subject ID provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await syllabusService.getBySubject(Number(subjectId));
                setSyllabusList(data);
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to load syllabus';
                setError(errorMessage);
                showError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchSyllabus();
    }, [subjectId]);

    /**
     * Handles the view action for a syllabus
     * Increments view count and displays PDF viewer
     * @param {Syllabus} syllabus - The syllabus to view
     */
    const handleView = async (syllabus: Syllabus) => {
        if (!syllabus.file_url) {
            showError('No file available for this syllabus');
            return;
        }
        try {
            await syllabusService.incrementView(syllabus.id);
            setSelectedSyllabus(syllabus);
        } catch {
            showError('Failed to view syllabus');
        }
    };

    /**
     * Handles the download action for a syllabus
     * Downloads the PDF file and increments download count
     * @param {Syllabus} syllabus - The syllabus to download
     */
    const handleDownload = async (syllabus: Syllabus) => {
        try {
            if (!syllabus.file_url) {
                showError('No file available for this syllabus');
                return;
            }

            const response = await fetch(syllabus.file_url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${decodeURIComponent(String(subjectName))}_Syllabus_${syllabus.version}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            // Increment download count
            try {
                await syllabusService.incrementDownload(syllabus.id);
            } catch (err) {
                // Log error but don't show to user as download was successful
                console.warn('Failed to increment download count:', err);
            }
            
            showSuccess('Syllabus downloaded successfully');
        } catch (error: unknown) {
            console.error('Download error:', error);
            showError('Failed to download syllabus. Please try again.');
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    // Show PDF viewer when a syllabus is selected
    if (selectedSyllabus) {
        return (
            <PDFViewer
                pdfUrl={selectedSyllabus.file_url}
                title="Syllabus"
                mainHeading={subjectName || ''}
                subHeading={`Version ${selectedSyllabus.version}`}
                onBack={() => setSelectedSyllabus(null)}
            />
        );
    }

    // Show loading state
    if (loading) {
        return <LoadingSpinner />;
    }

    // Show error state
    if (error) {
        return (
            <div className="p-4">
                <div className="text-red-500">{error}</div>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-indigo-50/20 to-blue-50/20 pointer-events-none"></div>
            <motion.div
                animate={{
                    y: [0, -30, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute right-[15%] top-[15%]"
            >
                <div className="h-28 w-28 text-purple-600/10">
                    <BookOpen size="100%" />
                </div>
            </motion.div>

            {/* Main content */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="container mx-auto px-4 py-6 max-w-7xl relative z-10"
            >
                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="mb-12 space-y-6"
                >
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 py-2 text-center">
                        {decodeURIComponent(String(subjectName))}
                    </h1>
                    <div className="flex items-center">
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(-1)}
                            className="group inline-flex items-center px-5 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                            Back
                        </motion.button>
                    </div>
                </motion.div>

                {/* Syllabus grid */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {syllabusList.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Syllabus Available</h3>
                            <p className="text-gray-500">No syllabus has been uploaded for this subject yet.</p>
                        </div>
                    ) : (
                        syllabusList.map((syllabus) => (
                            <motion.div
                                key={syllabus.id}
                                variants={itemVariants}
                                className={`group bg-white rounded-xl shadow-sm border border-indigo-100/50 p-6 relative 
                                    hover:shadow-md hover:border-indigo-200 transition-all duration-300 cursor-pointer
                                    ${syllabus.is_current ? 'ring-2 ring-indigo-500' : ''}`}
                                onClick={() => handleView(syllabus)}
                            >
                                {syllabus.is_current && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white px-3 py-0.5 rounded-full text-xs font-medium">
                                        Current Version
                                    </span>
                                )}
                                
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {subjectName}
                                        </h3>
                                        <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                                            Version {syllabus.version}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-6">
                                        {syllabus.description || 'No description available'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-500 space-x-6">
                                            <span className="flex items-center group-hover:text-indigo-600 transition-colors">
                                                <Eye className="h-4 w-4 mr-1.5" />
                                                {syllabus.view_count} Views
                                            </span>
                                            <span className="flex items-center group-hover:text-indigo-600 transition-colors">
                                                <Calendar className="h-4 w-4 mr-1.5" />
                                                {new Date(syllabus.upload_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(syllabus);
                                            }}
                                            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            <Download className="h-4 w-4 mr-1.5" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-xl" />
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SubjectSyllabusList; 