import { Router, Request, Response } from "express";
import { Avatar } from "../models";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { imageUrl, name } = req.body;
    const avatar = await Avatar.create({ imageUrl, name });
    res.status(201).json(avatar);
  } catch (err) {
    res.status(400).json({ error: "Failed to create avatar", details: err });
  }
});

router.get("/", async (_req: Request, res: Response) => {
  try {
    const avatars = await Avatar.find();
    res.status(200).json(avatars);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch avatars" });
  }
});

export default router;
