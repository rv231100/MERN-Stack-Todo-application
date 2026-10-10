import express from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// ------Public Routes------
//Register User
router.post("/register", registerUser);

//Login User
router.post("/login", loginUser);

//Logout User
router.post("/logout", logoutUser);
// ---------------------------------------------

// --Protected Route------
router.get("/me", protect, getCurrentUser);

export default router;
