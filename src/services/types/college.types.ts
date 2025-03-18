export interface College {
    // Basic Information
    id: number;
    name: string;
    slug: string;
    established_year?: number;
    
    // Contact & Location
    location: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    contact_primary: string;
    contact_secondary?: string;
    email: string;
    website?: string;
    full_address: string;
    
    // Academic Information
    affiliation: string;
    accreditation?: string;
    institution_type: 'public' | 'private' | 'community';
    
    // Metrics & Rankings
    rating: number;
    total_students?: number;
    student_teacher_ratio?: string;
    placement_rate?: number;
    
    // Features & Facilities
    facilities: string[];
    courses_offered: string[];
    specializations: string[];
    
    // Media
    logo?: string;
    image: string;
    gallery_images: string[];
    virtual_tour_url?: string;
    
    // Additional Information
    description: string;
    achievements: string[];
    notable_alumni: string[];
    scholarships_available: boolean;
    
    // Social Media
    facebook_url?: string;
    twitter_url?: string;
    linkedin_url?: string;
    instagram_url?: string;
    
    // Meta Information
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface CollegeFilters {
    search?: string;
    rating?: number;
    affiliation?: string;
    institution_type?: string;
    city?: string;
    state?: string;
    courses?: string[];
    is_featured?: boolean;
    accreditation?: string;
}

export interface CollegeContextType {
    colleges: College[];
    loading: boolean;
    error: string | null;
    filters: CollegeFilters;
    setFilters: (filters: CollegeFilters) => void;
    fetchColleges: () => Promise<void>;
}