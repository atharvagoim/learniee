export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  subject: string;
  grade: string;
  price: number;
  teacherName: string;
  teacherRating: number;
  teacherReviewCount: number;
  duration: string;
  lessons: number;
  level: string;
  mode: string;
  language: string;
  image: string;
  createdAt: string;
  isFavorited?: boolean;
  isInCart?: boolean;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: PaginationMeta;
}
