export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: Category;
  tags: Tag[];
  featured: boolean;
  bookmarked: boolean;
  dateAdded: string;
  difficultyLevel: string;
  resourceType: string;
} 