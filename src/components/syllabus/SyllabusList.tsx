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
 * Displays a list of syllabus versions for a specific subject with options to view and download.
 */
const SubjectSyllabusList: React.FC = () => {
    const { subjectId, subjectName } = useParams();
    const navigate = useNavigate();
    const [syllabusList, setSyllabusList] = useState<Syllabus[]>([]);
    const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch syllabus data
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
            } catch (error: any) {
                const errorMessage = error?.response?.data?.error || error?.message || 'Failed to load syllabus';
                setError(errorMessage);
                showError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchSyllabus();
    }, [subjectId]);

    // Handle view action
    const handleView = async (syllabus: Syllabus) => {
        if (!syllabus.file_url) {
            showError('No file available for this syllabus');
            return;
        }
        try {
            await syllabusService.incrementView(syllabus.id);
            setSelectedSyllabus(syllabus);
        } catch (error) {
            showError('Failed to view syllabus');
        }
    };

    // Handle download action
    const handleDownload = async (syllabus: Syllabus) => {
        try {
            const downloadUrl = await syllabusService.getDownloadUrl(syllabus.id);
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error('Download failed');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${subjectName}_Syllabus_${syllabus.version}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            showSuccess('Syllabus downloaded successfully');
        } catch (error) {
            showError('Failed to download syllabus');
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
                {/* Back button */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(-1)}
                    className="group mb-6 inline-flex items-center px-6 py-2.5 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
                >
                    <ArrowLeft className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    Back
                </motion.button>

                {/* Header */}
                <motion.div
                    variants={itemVariants}
                    className="mb-8 text-center space-y-3"
                >
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                        {decodeURIComponent(String(subjectName))}
                    </h1>
                    <p className="text-indigo-600 text-xl font-medium">
                        {syllabusList.length} {syllabusList.length === 1 ? 'Version' : 'Versions'} Available
                    </p>
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
                                className={`bg-white rounded-xl shadow-sm border border-purple-100/50 p-6 relative ${
                                    syllabus.is_current ? 'ring-2 ring-purple-500' : ''
                                }`}
                            >
                                {syllabus.is_current && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Current Version
                                    </span>
                                )}
                                <div className="flex flex-col h-full">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Version {syllabus.version}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {syllabus.description || 'No description available'}
                                        </p>
                                        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                                            <span className="flex items-center">
                                                <Eye className="h-4 w-4 mr-1" />
                                                {syllabus.view_count}
                                            </span>
                                            <span className="flex items-center">
                                                <Download className="h-4 w-4 mr-1" />
                                                {syllabus.download_count}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {new Date(syllabus.upload_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleView(syllabus)}
                                            className="flex-1 bg-purple-50 text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDownload(syllabus)}
                                            className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SubjectSyllabusList; 