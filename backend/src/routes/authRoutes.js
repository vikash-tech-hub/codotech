import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

const issueToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, rollNumber: user.rollNumber }, process.env.JWT_SECRET, {
    expiresIn: "8h"
  });

router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ role: "admin" });

    if (existing) {
      return res.status(400).json({ message: "Admin already registered" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: "admin" });

    return res.status(201).json({ token: issueToken(user), role: user.role, name: user.name });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/register-student", async (req, res) => {
  try {
    const { name, rollNumber, email, password, course, semester } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      rollNumber,
      email,
      password: hash,
      role: "student",
      course,
      semester
    });

    return res.status(201).json({ id: user._id, rollNumber: user.rollNumber });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

    const query = role === "admin" ? { role: "admin", email: identifier } : { role: "student", rollNumber: identifier };
    const user = await User.findOne(query).populate("course semester");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: issueToken(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        rollNumber: user.rollNumber,
        email: user.email,
        course: user.course,
        semester: user.semester
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
