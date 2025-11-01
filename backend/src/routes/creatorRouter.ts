import express, { Request, Response } from "express";
import { authMiddleware } from "../middlewares";
import { Avatar, Element, Map } from "../models";
import { IMap } from "../types";

const router = express.Router();

router.post("/element", authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      name,
      isWall,
      imageUrl,
      width,
      height,
      static: isStatic,
      visible,
    } = req.body;
    if (
      !name ||
      !imageUrl ||
      !width ||
      !height ||
      isStatic === undefined ||
      visible == undefined
    ) {
      console.log(name, imageUrl, width, height, isStatic, visible);
      return res.status(400).json({ error: "Missing required fields" });
    }
    const element = new Element({
      name,
      isWall,
      imageUrl,
      width,
      height,
      static: isStatic,
      visible,
    });
    await element.save();
    return res.status(201).json({
      message: "Element created successfully",
      element,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err });
  }
});

router.put(
  "/element/:elementId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { elementId } = req.params;
      const { imageUrl, static: isStatic, visible } = req.body;
      const element = await Element.findById(elementId);
      if (!element) {
        return res.status(404).json({ error: "Element not found" });
      }
      if (imageUrl) element.imageUrl = imageUrl;
      if (isStatic !== undefined) element.static = isStatic;
      if (visible !== undefined) element.visible = visible;

      if (req.body.width || req.body.height) {
        return res.status(400).json({
          error: "Width and height cannot be updated once created",
        });
      }
      await element.save();
      return res.status(200).json({
        message: "Element updated successfully",
        element,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error", details: err });
    }
  }
);

router.post("/avatar", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { imageUrl, name } = req.body;
    if (!imageUrl || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const avatar = new Avatar({ imageUrl, name });
    await avatar.save();
    return res.status(201).json({
      message: "Avatar created successfully",
      avatar,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err });
  }
});

router.post("/map", async (req: Request, res: Response) => {
  try {
    const { name, dimensions, defaultElements, thumbnail } = req.body;
    if (!name || !dimensions) {
      return res
        .status(400)
        .json({ message: "Name and dimensions are required." });
    }
    const newMap: IMap = new Map({
      name,
      dimensions,
      defaultElements: defaultElements || [],
      thumbnail: thumbnail || "https://placehold.co/200x200",
    });
    const savedMap = await newMap.save();
    return res.status(201).json(savedMap);
  } catch (error) {
    console.error("Error creating map:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
