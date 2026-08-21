export interface SubjectConfig {
  subject: string;
  minGrade: number; // index into GRADES (0 = Kindergarten ... 12 = Grade 12)
  maxGrade: number;
  count: number; // approx number of courses to generate for this subject
  templates: string[]; // use {grade} as a placeholder
}

export const SUBJECT_CONFIG: SubjectConfig[] = [
  { subject: "Mathematics", minGrade: 0, maxGrade: 12, count: 24, templates: [
    "Mathematics Foundations for {grade}", "Mastering {grade} Mathematics", "Fun with Numbers: {grade}",
    "Core Mathematics Skills", "{grade} Math Bootcamp", "Building Number Confidence",
  ] },
  { subject: "Algebra", minGrade: 6, maxGrade: 12, count: 16, templates: [
    "Algebra Foundations", "Mastering {grade} Algebra", "Algebra Made Simple",
    "Algebraic Thinking for {grade}", "Advanced Algebra Techniques",
  ] },
  { subject: "Geometry", minGrade: 5, maxGrade: 12, count: 16, templates: [
    "Mastering {grade} Geometry", "Geometry Foundations", "Shapes, Angles and Proofs",
    "Geometry Made Simple", "Applied Geometry for {grade}",
  ] },
  { subject: "Science", minGrade: 0, maxGrade: 8, count: 22, templates: [
    "Science Explorers: {grade}", "Hands-On Science for {grade}", "Science Through Experiments",
    "Curious Minds: General Science", "{grade} Science Lab",
  ] },
  { subject: "Physics", minGrade: 8, maxGrade: 12, count: 18, templates: [
    "Physics Through Experiments", "Mastering {grade} Physics", "Physics Fundamentals",
    "Applied Physics for {grade}", "Advanced Physics Concepts",
  ] },
  { subject: "Chemistry", minGrade: 8, maxGrade: 12, count: 18, templates: [
    "Chemistry Made Simple", "Mastering {grade} Chemistry", "Chemistry in Everyday Life",
    "Advanced Chemistry", "Chemistry Lab Essentials for {grade}",
  ] },
  { subject: "Biology", minGrade: 6, maxGrade: 12, count: 18, templates: [
    "Advanced Biology", "Biology Foundations for {grade}", "Exploring Life Sciences",
    "Human Biology Essentials", "{grade} Biology Deep Dive",
  ] },
  { subject: "English", minGrade: 0, maxGrade: 12, count: 22, templates: [
    "English Language Essentials", "Confident English for {grade}", "Reading and Writing Skills",
    "English Foundations", "{grade} English Mastery",
  ] },
  { subject: "Grammar", minGrade: 1, maxGrade: 8, count: 12, templates: [
    "Grammar Essentials", "Mastering Grammar for {grade}", "Grammar Made Fun",
    "Sentence Structure Basics",
  ] },
  { subject: "Literature", minGrade: 6, maxGrade: 12, count: 12, templates: [
    "Introduction to Literature", "Exploring Classic Literature", "Literature and Storytelling for {grade}",
    "Modern Literature Essentials",
  ] },
  { subject: "History", minGrade: 3, maxGrade: 12, count: 16, templates: [
    "World History Essentials", "Exploring History for {grade}", "Ancient Civilizations",
    "Modern History Foundations", "History Through Stories",
  ] },
  { subject: "Geography", minGrade: 3, maxGrade: 12, count: 14, templates: [
    "World Geography Essentials", "Exploring Geography for {grade}", "Maps, Climate and Culture",
    "Physical Geography Foundations",
  ] },
  { subject: "Computer Science", minGrade: 4, maxGrade: 12, count: 20, templates: [
    "Computer Science Fundamentals", "Intro to Computer Science for {grade}", "Computational Thinking",
    "Computer Science Essentials", "Building Logic with Computer Science",
  ] },
  { subject: "Programming", minGrade: 5, maxGrade: 12, count: 16, templates: [
    "Programming Foundations for {grade}", "Learn to Code: Programming Basics", "Programming for Young Minds",
    "Building Apps: Programming Essentials",
  ] },
  { subject: "Python", minGrade: 6, maxGrade: 12, count: 18, templates: [
    "Python Programming for Young Minds", "Mastering Python for {grade}", "Python Basics to Advanced",
    "Python for Beginners", "Building Projects with Python",
  ] },
  { subject: "Web Development", minGrade: 8, maxGrade: 12, count: 12, templates: [
    "Web Development Bootcamp", "Building Websites for {grade}", "Full-Stack Basics for Teens",
    "HTML, CSS and JavaScript Essentials",
  ] },
  { subject: "Robotics", minGrade: 4, maxGrade: 12, count: 16, templates: [
    "Robotics for Young Engineers", "Intro to Robotics for {grade}", "Build Your First Robot",
    "Robotics and Automation Basics",
  ] },
  { subject: "Artificial Intelligence", minGrade: 7, maxGrade: 12, count: 16, templates: [
    "Introduction to Artificial Intelligence", "AI for Young Innovators", "Machine Learning Foundations for {grade}",
    "Exploring AI and Its Applications",
  ] },
  { subject: "Art", minGrade: 0, maxGrade: 8, count: 14, templates: [
    "Creative Art for {grade}", "Art and Imagination", "Exploring Colors and Shapes",
    "Art Foundations for Young Artists",
  ] },
  { subject: "Drawing", minGrade: 0, maxGrade: 8, count: 12, templates: [
    "Drawing Essentials for {grade}", "Sketching for Beginners", "Creative Drawing Adventures",
    "Learn to Draw: Foundations",
  ] },
  { subject: "Music", minGrade: 0, maxGrade: 12, count: 14, templates: [
    "Music Foundations for {grade}", "Discovering Rhythm and Melody", "Introduction to Music Theory",
    "Music Appreciation for Young Learners",
  ] },
  { subject: "Coding", minGrade: 3, maxGrade: 12, count: 18, templates: [
    "Coding for Kids: {grade}", "Intro to Coding Concepts", "Coding Adventures for Young Minds",
    "Block to Code: Coding Essentials",
  ] },
  { subject: "Public Speaking", minGrade: 3, maxGrade: 12, count: 12, templates: [
    "Public Speaking with Confidence", "Communication Skills for {grade}", "Finding Your Voice",
    "Confident Communication Essentials",
  ] },
  { subject: "Economics", minGrade: 9, maxGrade: 12, count: 10, templates: [
    "Economics Essentials for {grade}", "Understanding Markets and Money", "Intro to Microeconomics",
    "Everyday Economics",
  ] },
  { subject: "Environmental Science", minGrade: 4, maxGrade: 10, count: 12, templates: [
    "Environmental Science for {grade}", "Exploring Our Planet", "Sustainability and Ecology Basics",
    "Climate and Conservation Essentials",
  ] },
  { subject: "French", minGrade: 3, maxGrade: 12, count: 12, templates: [
    "French for Beginners: {grade}", "Conversational French Essentials", "Intro to French Language and Culture",
  ] },
  { subject: "Spanish", minGrade: 3, maxGrade: 12, count: 12, templates: [
    "Spanish for Beginners: {grade}", "Conversational Spanish Essentials", "Intro to Spanish Language and Culture",
  ] },
  { subject: "Logical Reasoning", minGrade: 3, maxGrade: 12, count: 14, templates: [
    "Logical Reasoning Essentials", "Sharpen Your Mind: Logic Basics", "Puzzles and Logical Thinking for {grade}",
  ] },
  { subject: "Competitive Exams", minGrade: 8, maxGrade: 12, count: 14, templates: [
    "Competitive Exam Foundations", "Olympiad Prep for {grade}", "Scholarship Exam Essentials",
    "Advanced Problem Solving for Competitive Exams",
  ] },
];
