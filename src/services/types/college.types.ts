export interface College {
    id: number;
    name: string;
    location: string;
    contact: string;
    affiliation: string;
    rating: number | string;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface CollegeFilters {
    search?: string;
    rating?: number;
    affiliation?: string;
}

export interface CollegeContextType {
    colleges: College[];
    loading: boolean;
    error: string | null;
    filters: CollegeFilters;
    setFilters: (filters: CollegeFilters) => void;
    fetchColleges: () => Promise<void>;
}