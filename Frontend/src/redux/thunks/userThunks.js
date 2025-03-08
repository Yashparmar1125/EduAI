import {
  updateUserProfile,
  updateAvatarStyle,
  updateAvatarSeed,
  updateAvatarUrl,
} from "../slices/userSlice";
import { showNotificationWithTimeout } from "../slices/notificationSlice";
import { createAvatar } from "@dicebear/core";
import {
  adventurer,
  lorelei,
  bottts,
  avataaars,
  funEmoji,
} from "@dicebear/collection";

// Update user profile with notification
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateUserProfile(userData));
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "success",
        message: "Profile updated successfully!",
      })
    );
  } catch (error) {
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "error",
        message: "Failed to update profile",
      })
    );
  }
};

// Update avatar style with notification
export const updateStyle = (style) => async (dispatch) => {
  try {
    dispatch(updateAvatarStyle(style));
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "success",
        message: "Avatar style updated!",
      })
    );
  } catch (error) {
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "error",
        message: "Failed to update avatar style",
      })
    );
  }
};

// Update avatar seed and generate new avatar
export const updateSeed = (seed) => async (dispatch) => {
  try {
    dispatch(updateAvatarSeed(seed));

    // Get current style from state
    const state = store.getState();
    const currentStyle = state.user.avatarStyle;

    // Generate new avatar
    let styleCollection;
    switch (currentStyle) {
      case "lorelei":
        styleCollection = lorelei;
        break;
      case "bottts":
        styleCollection = bottts;
        break;
      case "avataaars":
        styleCollection = avataaars;
        break;
      case "funEmoji":
        styleCollection = funEmoji;
        break;
      default:
        styleCollection = adventurer;
    }

    const avatar = createAvatar(styleCollection, {
      seed: seed,
      size: 128,
    });

    const svg = avatar.toString();
    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    dispatch(updateAvatarUrl(dataUrl));
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "success",
        message: "Avatar updated successfully!",
      })
    );
  } catch (error) {
    dispatch(
      showNotificationWithTimeout({
        show: true,
        type: "error",
        message: "Failed to update avatar",
      })
    );
  }
};
