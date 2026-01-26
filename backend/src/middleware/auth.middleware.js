import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user to request
    req.user = await User.findById(decoded.id).select("-password"); // no password
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next(); // ✅ Pass to next middleware or route
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
