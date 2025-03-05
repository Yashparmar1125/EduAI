import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  achievements: [],
  loading: false,
  error: null,
};

const achievementSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {
    setAchievements: (state, action) => {
      state.achievements = action.payload;
    },
    updateAchievementProgress: (state, action) => {
      const { id, progress } = action.payload;
      const achievement = state.achievements.find((a) => a.id === id);
      if (achievement) {
        achievement.progress = progress;
        if (progress >= 100) {
          achievement.unlocked = true;
        }
      }
    },
    unlockAchievement: (state, action) => {
      const achievementId = action.payload;
      const achievement = state.achievements.find(
        (a) => a.id === achievementId
      );
      if (achievement) {
        achievement.unlocked = true;
        achievement.progress = 100;
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
  setAchievements,
  updateAchievementProgress,
  unlockAchievement,
  setLoading,
  setError,
} = achievementSlice.actions;

export default achievementSlice.reducer;
