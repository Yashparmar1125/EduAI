import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  learningPaths: [],
  continueLearning: [],
  trendingCourses: [],
  loading: false,
  error: null,
};

const learningSlice = createSlice({
  name: "learning",
  initialState,
  reducers: {
    setLearningPaths: (state, action) => {
      state.learningPaths = action.payload;
    },
    setContinueLearning: (state, action) => {
      state.continueLearning = action.payload;
    },
    setTrendingCourses: (state, action) => {
      state.trendingCourses = action.payload;
    },
    updateLearningPathProgress: (state, action) => {
      const { id, progress } = action.payload;
      const path = state.learningPaths.find((p) => p.id === id);
      if (path) {
        path.progress = progress;
      }
    },
    updateContinueLearningProgress: (state, action) => {
      const { id, progress } = action.payload;
      const course = state.continueLearning.find((c) => c.id === id);
      if (course) {
        course.progress = progress;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLearningPaths,
  setContinueLearning,
  setTrendingCourses,
  updateLearningPathProgress,
  updateContinueLearningProgress,
  setLoading,
  setError,
} = learningSlice.actions;

export default learningSlice.reducer;
