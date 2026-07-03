export interface Course {
  id: string;
  title: string;
  badge?: string;
  tagline: string;
  description: string;
  iconName: string; // Dynamic lookup for Lucide icons
  duration: string;
  syllabusOverview: string[];
}

export interface Advantage {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  specialty: string;
  education: string;
  experience: string;
  bio: string;
  image: string;
}

export interface Topper {
  id: string;
  name: string;
  rank: number;
  year: number;
  image: string;
  quote: string;
  strategy: string;
}

export interface BatchSchedule {
  id: string;
  name: string;
  startDate: string;
  mode: 'Offline + Online' | 'Online Exclusive' | 'Offline Only';
  availability: 'Limited Seats' | 'Open' | 'Last 5 Seats' | 'Coming Soon' | 'Closed';
  seatsCount?: number;
}

export interface InquiryFormInput {
  fullName: string;
  phone: string;
  email: string;
  course: string;
  message?: string;
}
