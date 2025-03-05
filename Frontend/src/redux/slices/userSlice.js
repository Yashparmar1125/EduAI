import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: "",
  email: "",
  role: "",
  badges: [],
  enrolledCourses: [],
  completedCourses: [],
  certificates: [],
  avatarStyle: "adventurer",
  avatarSeed: "",
  avatarUrl: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserProfile: (state, action) => {
      const {
        id,
        name,
        email,
        role,
        skills,
        badges,
        enrolledCourses,
        completedCourses,
        certificates,
      } = action.payload;

      state.id = id;
      state.name = name;
      state.email = email;
      state.role = role;
      state.skills = skills;
      state.badges = badges;
      state.enrolledCourses = enrolledCourses;
      state.completedCourses = completedCourses;
      state.certificates = certificates;
    },
    updateAvatarStyle: (state, action) => {
      state.avatarStyle = action.payload;
    },
    updateAvatarSeed: (state, action) => {
      state.avatarSeed = action.payload;
    },
    updateAvatarUrl: (state, action) => {
      state.avatarUrl = action.payload;
    },
    enrollInCourse: (state, action) => {
      const courseId = action.payload;
      if (!state.enrolledCourses.includes(courseId)) {
        state.enrolledCourses.push(courseId);
      }
    },
    completeCourse: (state, action) => {
      const courseId = action.payload;
      if (
        state.enrolledCourses.includes(courseId) &&
        !state.completedCourses.includes(courseId)
      ) {
        state.completedCourses.push(courseId);
        state.enrolledCourses = state.enrolledCourses.filter(
          (id) => id !== courseId
        );
      }
    },
  },
});

export const {
  updateUserProfile,
  updateAvatarStyle,
  updateAvatarSeed,
  updateAvatarUrl,
  enrollInCourse,
  completeCourse,
} = userSlice.actions;

export default userSlice.reducer;
