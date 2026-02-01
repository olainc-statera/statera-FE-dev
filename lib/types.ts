export interface Studio {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  distance: string;
  categories: string[];
  priceRange: string;
  featured?: boolean;
}

export interface FitnessClass {
  id: string;
  name: string;
  studioId: string;
  studioName: string;
  instructor: string;
  instructorImage: string;
  category: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price: number;
  originalPrice?: number;
  datetime: string;
  spotsLeft: number;
  totalSpots: number;
  image: string;
  description: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  memberSince: string;
  classesAttended: number;
  favoriteCategories: string[];
  credits: number;
}

export interface Booking {
  id: string;
  classId: string;
  className: string;
  studioName: string;
  datetime: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
}

export interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  className?: string;
  studioName?: string;
}

export interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  date: string;
  helpful: number;
}
