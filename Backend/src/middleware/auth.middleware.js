import { verifyToken } from "../utils/jwt.util.js";
import User from "../models/user.model.js";
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized Acess", success: false });
    }
    const decode = verifyToken(token);
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized " });
    }
    req.user = decode;
    const user = await User.findById(req.user.userId);
    req.user.role = user.role;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Invalid Token", success: false });
  }
};

export default authMiddleware;
