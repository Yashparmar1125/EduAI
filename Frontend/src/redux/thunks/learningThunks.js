import {
  updateLearningPathProgress,
  updateContinueLearningProgress,
  enrollInCourse,
} from "../slices/learningSlice";
import { updateAchievementProgress } from "../slices/achievementSlice";
import { showNotificationWithTimeout } from "../slices/notificationSlice";

// Update learning path progress
export const updatePathProgress = (pathId, progress) => async (dispatch) => {
  try {
    dispatch(updateLearningPathProgress({ id: pathId, progress }));

    // Check if path is completed
    if (progress === 100) {
      dispatch(
        showNotificationWithTimeout({
          show: true,
          type: "success",
          message: "Learning path completed!",
        })
      );
    }
  } catch (error) {
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "error",
        message: "Failed to update learning path progress",
      })
    );
  }
};

// Update course progress
export const updateCourseProgress =
  (courseId, progress) => async (dispatch) => {
    try {
      dispatch(updateContinueLearningProgress({ id: courseId, progress }));

      // Check if course is completed
      if (progress === 100) {
        dispatch(
          showNotificationWithTimeout({
            show: true,
            type: "success",
            message: "Course completed!",
          })
        );

        // Update achievement progress
        dispatch(
          updateAchievementProgress({
            id: 1, // Fast Learner achievement
            progress: 100,
          })
        );
      }
    } catch (error) {
      dispatch(
        showNotificationWithTimeout({
          show: true,
          type: "error",
          message: "Failed to update course progress",
        })
      );
    }
  };

// Enroll in a course
export const enrollCourse = (courseId) => async (dispatch) => {
  try {
    dispatch(enrollInCourse(courseId));
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "success",
        message: "Successfully enrolled in course!",
      })
    );
  } catch (error) {
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "error",
        message: "Failed to enroll in course",
      })
    );
  }
};
