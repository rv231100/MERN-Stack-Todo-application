import jwt from "jsonwebtoken";
import { userModel } from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        msg: "Not Authenticated",
      });
    }

    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded JWT : ", decoded);

    //Find user
    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        msg: "User not found",
      });
    }

    //attach user to req
    req.user = user;

    next();
  } catch (err) {
    console.error("Middleware authentication error : ", err);
    res.status(401).json({
      msg: "Invalid or expired token",
    });
  }
};
