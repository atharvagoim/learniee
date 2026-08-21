export const GRADES = [
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
] as const;

export function gradeOrder(grade: string) {
  const idx = GRADES.indexOf(grade as (typeof GRADES)[number]);
  return idx === -1 ? 0 : idx;
}

export const SUBJECTS = [
  "Mathematics",
  "Algebra",
  "Geometry",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Grammar",
  "Literature",
  "History",
  "Geography",
  "Computer Science",
  "Programming",
  "Python",
  "Web Development",
  "Robotics",
  "Artificial Intelligence",
  "Art",
  "Drawing",
  "Music",
  "Coding",
  "Public Speaking",
  "Economics",
  "Environmental Science",
  "French",
  "Spanish",
  "Logical Reasoning",
  "Competitive Exams",
] as const;

export const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export const MODES = ["Live", "Recorded", "Hybrid"] as const;
export const LANGUAGES = ["English", "Hindi", "Marathi", "English + Hindi"] as const;

export const DURATIONS = [
  { label: "4 weeks", weeks: 4, lessons: 12 },
  { label: "6 weeks", weeks: 6, lessons: 18 },
  { label: "8 weeks", weeks: 8, lessons: 24 },
  { label: "10 weeks", weeks: 10, lessons: 30 },
  { label: "12 weeks", weeks: 12, lessons: 36 },
  { label: "16 weeks", weeks: 16, lessons: 48 },
];

export const PRICE_POINTS = [
  499, 699, 799, 999, 1299, 1499, 1999, 2499, 2999, 3499, 3999, 4999, 5999, 6999, 7999, 9999,
];

export const RATING_POINTS = [3.5, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0];

export const PRICE_RANGES = [
  { label: "Any Price", value: "", min: undefined as number | undefined, max: undefined as number | undefined },
  { label: "Under \u20b91,000", value: "under-1000", min: 0, max: 999 },
  { label: "\u20b91,000 \u2013 \u20b92,500", value: "1000-2500", min: 1000, max: 2500 },
  { label: "\u20b92,500 \u2013 \u20b95,000", value: "2500-5000", min: 2500, max: 5000 },
  { label: "\u20b95,000+", value: "5000-plus", min: 5000, max: undefined },
];

export const RATING_FILTERS = [
  { label: "Any Rating", value: "", min: undefined as number | undefined },
  { label: "4.0+", value: "4.0", min: 4.0 },
  { label: "4.5+", value: "4.5", min: 4.5 },
  { label: "4.7+", value: "4.7", min: 4.7 },
  { label: "4.9+", value: "4.9", min: 4.9 },
];

export const SORT_LABELS: Record<string, string> = {
  recommended: "Recommended",
  price_asc: "Price: Low \u2192 High",
  price_desc: "Price: High \u2192 Low",
  rating_desc: "Rating: High \u2192 Low",
  newest: "Newest",
};

export const POPULAR_SUBJECTS = [
  "Mathematics",
  "Science",
  "Coding",
  "English",
  "Physics",
  "Computer Science",
  "Robotics",
  "Art",
];

export const PAYMENT_METHODS = ["UPI", "Card", "Net Banking"] as const;

export const PAYMENT_METHOD_LABELS: Record<(typeof PAYMENT_METHODS)[number], string> = {
  UPI: "UPI",
  Card: "Credit / Debit Card",
  "Net Banking": "Net Banking",
};
