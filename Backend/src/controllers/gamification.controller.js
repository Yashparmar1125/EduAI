import { updateXP } from "../utils/gamification.util.js";

export const updatexp = async (req, res) => {
  try {
    const { xpEarned } = req.body;
    const userId = req.user.userId;
    await updateXP(userId, xpEarned);
    res.status(200).json({ message: "XP updated successfully", sucess: true });
  } catch (error) {
    res.status(500).json({ message: "Error updating XP", sucess: false });
  }
};
