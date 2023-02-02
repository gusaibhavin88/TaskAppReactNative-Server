import jwt from "jsonwebtoken";
import { User } from "../models/users.js";

export const isAuthenticated = async (req, resp, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      resp.status(401).json({ success: false, message: "Login First" });
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded._id);
      next();
    }
  } catch (error) {
    resp.status(500).json("Authentification fail");
  }
};
