import {
  updateAchievementProgress,
  unlockAchievement,
} from "../slices/achievementSlice";
import { showNotificationWithTimeout } from "../slices/notificationSlice";

// Update achievement progress
export const updateProgress = (achievementId, progress) => async (dispatch) => {
  try {
    dispatch(updateAchievementProgress({ id: achievementId, progress }));

    // Check if achievement is unlocked
    if (progress >= 100) {
      dispatch(
        showNotificationWithTimeout({
          show: true,
          type: "success",
          message: "Achievement unlocked!",
        })
      );
    }
  } catch (error) {
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "error",
        message: "Failed to update achievement progress",
      })
    );
  }
};

// Unlock achievement
export const unlockAchievementThunk = (achievementId) => async (dispatch) => {
  try {
    dispatch(unlockAchievement(achievementId));
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "success",
        message: "Achievement unlocked!",
      })
    );
  } catch (error) {
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "error",
        message: "Failed to unlock achievement",
      })
    );
  }
};
