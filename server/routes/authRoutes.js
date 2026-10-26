
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const COOKIE_NAME = "token";
const TOKEN_EXPIRY = "7d";

// Create a JWT token
function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from the server environment.");
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// Set the authentication cookie
function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

// Remove sensitive fields before sending a user to the browser
function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.username || user.name || "",
    email: user.email,
  };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const name =
      typeof req.body?.name === "string"
        ? req.body.name.trim()
        : "";

    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body?.password === "string"
        ? req.body.password
        : "";

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name, email, and password.",
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Your name must contain at least 2 characters.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Your password must contain at least 8 characters.",
      });
    }

    const db = getDB();
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Please sign in.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const userToCreate = {
      username: name,
      email,
      passwordHash,
      createdAt: new Date(),
    };

    const result = await users.insertOne(userToCreate);

    const newUser = {
      ...userToCreate,
      _id: result.insertedId,
    };

    const token = createToken(newUser);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Your FocusFlow account was created successfully!",
      user: publicUser(newUser),
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Please sign in.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create your account. Please try again.",
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body?.password === "string"
        ? req.body.password
        : "";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    const db = getDB();
    const user = await db.collection("users").findOne({ email });

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Welcome back to FocusFlow!",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to sign in. Please try again.",
    });
  }
});

// GET /api/auth/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const db = getDB();

    const userId = req.user?.userId || req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to continue.",
      });
    }

    const { ObjectId } = await import("mongodb");

    if (!ObjectId.isValid(userId)) {
      return res.status(401).json({
        success: false,
        message: "Your session is invalid. Please sign in again.",
      });
    }

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      { projection: { passwordHash: 0 } }
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found. Please sign in again.",
      });
    }

    return res.status(200).json({
      success: true,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Get current user error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to verify your session.",
    });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "You have signed out successfully.",
  });
});

export default router;