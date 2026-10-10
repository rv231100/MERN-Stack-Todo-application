import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userModel } from "../models/User.js";

//Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    //Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "Name, email, password are required",
      });
    }
    //check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        msg: "User already exist.",
      });
    }
    //Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create User
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      avatar: avatar || "",
    });

    //Generate Jwt
    const token = generateToken(user._id);

    //Store Jwt in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      msg: "User Registration Successfull.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Register error : ", err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

//Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validate fields
    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and Password are Required.",
      });
    }

    //Find User
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        msg: "Invaild email or password.",
      });
    }
    //Compare Password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        msg: "Invaild email or password.",
      });
    }

    //Generate Jwt
    const token = generateToken(user._id);

    //Store Jwt in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "Login Successfull",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("Login Error : ", err);
    res.status(500).json({
      msg: "Server Error",
    });
  }
};

//Logout User
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      msg: "Logout Successfull.",
    });
  } catch (err) {
    console.error("Logout Error : ", err);
    res.status(500).json({
      msg: "Server Error.",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Server error",
    });
  }
};

export { loginUser, registerUser, logoutUser, getCurrentUser };
