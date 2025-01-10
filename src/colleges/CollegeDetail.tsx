import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Building2, Star, Calendar, ArrowLeft } from 'lucide-react';
import { collegeService } from '../services/api/collegeService';
import type { College } from '../services/types/college.types';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CollegeDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [college, setCollege] = useState<College | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                setLoading(true);
                const response = await collegeService.getById(id!);
                setCollege({
                    ...response,
                    id: Number(response.id),
                    rating: Number(response.rating)
                } as College);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch college details');
            } finally {
                setLoading(false);
            }
        };

        fetchCollege();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!college) return <div>College not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Colleges
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
                <div className="relative h-64 sm:h-96">
                    <img
                        src={college.image}
                        alt={college.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40">
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h1 className="text-3xl font-bold">{college.name}</h1>
                            <div className="flex items-center mt-2">
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                <span className="ml-2 text-lg">{Number(college.rating).toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center text-gray-600">
                                <MapPin className="h-5 w-5 mr-2" />
                                <span>{college.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Phone className="h-5 w-5 mr-2" />
                                <span>{college.contact}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Building2 className="h-5 w-5 mr-2" />
                                <span>{college.affiliation}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-5 w-5 mr-2" />
                                <span>Established: {new Date(college.created_at).getFullYear()}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">About the College</h3>
                            <p className="text-gray-600">
                                {/* Add college description here when available in the model */}
                                A leading institution offering quality education in computer applications...
                            </p>
                            <button className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}