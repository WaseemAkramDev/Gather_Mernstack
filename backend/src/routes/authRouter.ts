import { Router, Request, Response } from "express";
import { signupSchema } from "../schemas";
import { User } from "../models";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/signin", async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.flatten() });
  }
  const { username, password } = result.data;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(403).json({ error: "Invalid username or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1h" }
    );
    return res.status(200).json({ token });
  } catch (err) {
    console.error("❌ Signin error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signup", async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    const formattedErrors = result.error.flatten().fieldErrors;
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "One or more fields are invalid.",
      errors: formattedErrors,
    });
  }
  const { username, password } = result.data;
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({
        code: "USERNAME_TAKEN",
        message: "Username is already taken. Please choose another one.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Signup successful!",
      userId: newUser._id,
    });
  } catch (err: any) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred. Please try again later.",
      details: err.message,
    });
  }
});

export default router;
