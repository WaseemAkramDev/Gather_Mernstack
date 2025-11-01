import { Router, Request, Response } from "express";
import { Element, Map, MetaData } from "../models";

const router = Router();

router.post("/metadata", async (req: Request, res: Response) => {
  try {
    const { userId, avatarImageUrl, avatarName } = req.body;
    const metadata = await MetaData.create({
      userId,
      avatarImageUrl,
      avatartName: avatarName,
    });
    res.status(201).json(metadata);
  } catch (err) {
    res.status(400).json({ error: "Failed to create metadata", details: err });
  }
});

router.put("/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { avatarImageUrl, avatarName } = req.body;
    const updated = await MetaData.findOneAndUpdate(
      { userId },
      { avatarImageUrl, avatartName: avatarName },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Metadata not found for user" });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update metadata", details: err });
  }
});

router.post("/metadata/by-users", async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;
    if (!Array.isArray(userIds)) {
      return res.status(400).json({ error: "userIds must be an array" });
    }
    const metadata = await MetaData.find({ userId: { $in: userIds } });
    res.status(200).json(metadata);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch metadata", details: err });
  }
});

router.get("/maps", async (req: Request, res: Response) => {
  try {
    const maps = await Map.find();
    return res.status(200).json(maps);
  } catch (error) {
    console.error("Error fetching maps:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/elements", async (req: Request, res: Response) => {
  try {
    const elements = await Element.find();
    return res.status(200).json(elements);
  } catch (error) {
    console.error("Error fetching elements:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
