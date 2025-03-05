import { createSlice } from "@reduxjs/toolkit";

// Default popular courses data
const defaultPopularCourses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description:
      "Learn HTML, CSS, and JavaScript basics to start your web development journey.",
    rating: "4.8",
    students: 1234,
    instructor: "Sarah Chen",
    duration: "8 weeks",
    price: "$49.99",
    level: "Beginner",
    image: "https://static.ditdot.hr/images/info/ux-ui/ux-ui-00.png",
  },
  {
    id: 2,
    title: "React & Next.js Mastery",
    description:
      "Master modern React development with Next.js, including server components and app router.",
    rating: "4.9",
    students: 856,
    instructor: "Mike Johnson",
    duration: "12 weeks",
    price: "$79.99",
    level: "Intermediate",
    image:
      "https://miro.medium.com/v2/resize:fit:600/1*KUjro0G-igf6P3lvlcDrTQ.png",
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    description:
      "Learn the fundamentals of user interface and experience design.",
    rating: "4.7",
    students: 2341,
    instructor: "Emma Davis",
    duration: "10 weeks",
    price: "$59.99",
    level: "Beginner",
    image:
      "https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/673f2a3b44c1ed4901bb43bb_6386328bea96dffacc89946b_d1.webp",
  },
];

const initialState = {
  courses: defaultPopularCourses,
  loading: false,
  error: null,
};

const popularSlice = createSlice({
  name: "popular",
  initialState,
  reducers: {
    setPopularCourses: (state, action) => {
      state.courses = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateCourseRating: (state, action) => {
      const { courseId, rating } = action.payload;
      const course = state.courses.find((c) => c.id === courseId);
      if (course) {
        course.rating = rating;
      }
    },
    updateCourseStudents: (state, action) => {
      const { courseId, students } = action.payload;
      const course = state.courses.find((c) => c.id === courseId);
      if (course) {
        course.students = students;
      }
    },
  },
});

export const {
  setPopularCourses,
  setLoading,
  setError,
  updateCourseRating,
  updateCourseStudents,
} = popularSlice.actions;

export default popularSlice.reducer;
