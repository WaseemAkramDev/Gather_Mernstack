import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares";
import { createSpaceSchema } from "../schemas/spaceSchema";
import { Space, Element, Map } from "../models";

const router = Router();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const result = createSpaceSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.flatten() });
  }
  try {
    const { name, dimensions, mapId, thumbnail } = result.data;
    const map = await Map.findById(mapId);
    if (!map) {
      return res.status(404).json({ error: "Map not found" });
    }
    const elements = map.defaultElements || [];
    const space = await Space.create({
      name,
      dimensions,
      elements,
      thumbnail: thumbnail || map.thumbnail,
      createdBy: (req as any).user.userId,
    });
    return res.status(201).json({ spaceId: space._id });
  } catch (err) {
    console.error("Failed to create space:", err);
    return res
      .status(500)
      .json({ error: "Failed to create space", details: err });
  }
});

router.delete(
  "/:spaceId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { spaceId } = req.params;
      const deleted = await Space.findOneAndDelete({
        _id: spaceId,
        createdBy: (req as any).user.userId,
      });
      if (!deleted) {
        return res
          .status(404)
          .json({ error: "Space not found or not owned by user" });
      }
      return res.status(200).json({ message: "Space deleted successfully" });
    } catch (err) {
      return res
        .status(400)
        .json({ error: "Failed to delete space", details: err });
    }
  }
);

router.get("/all", authMiddleware, async (req: Request, res: Response) => {
  try {
    const spaces = await Space.find();
    return res.status(200).json({
      spaces: spaces.map((s) => ({
        id: s._id,
        name: s.name,
        dimensions: s.dimensions,
        thumbnail: s.thumbnail,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch spaces" });
  }
});

router.get("/:spaceId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { spaceId } = req.params;
    const space = await Space.findById(spaceId);
    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }
    return res.status(200).json({
      dimensions: space.dimensions,
      elements: space.elements,
      name: space.name,
      thumbnail: space.thumbnail,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Failed to delete space", details: err });
  }
});

router.post("/element", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { elementId, spaceId, x, y } = req.body;
    if (!elementId || !spaceId || x === undefined || y === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const elementDef = await Element.findById(elementId);
    if (!elementDef)
      return res.status(404).json({ error: "Element not found" });
    const space = await Space.findById(spaceId);
    if (!space) return res.status(404).json({ error: "Space not found" });
    const mongoose = require("mongoose");
    const newElementId = new mongoose.Types.ObjectId();
    const newElement = {
      _id: newElementId,
      element: {
        name: elementDef.name,
        imageUrl: elementDef.imageUrl,
        static: elementDef.static,
        height: elementDef.height,
        width: elementDef.width,
        visible: elementDef.visible,
      },
      x,
      y,
      createdAt: new Date(),
    };
    const updatedSpace = await Space.findByIdAndUpdate(
      spaceId,
      { $push: { elements: newElement } },
      { new: true, runValidators: true }
    );
    if (!updatedSpace) {
      return res.status(404).json({ error: "Space not found" });
    }
    return res.status(200).json({
      success: true,
      id: newElementId.toString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err });
  }
});

router.delete(
  "/element/:spaceId/:elementPlacementId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { spaceId, elementPlacementId } = req.params;
      const space = await Space.findById(spaceId);
      if (!space) return res.status(404).json({ error: "Space not found" });
      const index = space.elements.findIndex(
        //@ts-ignore
        (el) => el._id?.toString() === elementPlacementId
      );
      if (index === -1)
        return res.status(404).json({ error: "Element not found in space" });
      //@ts-ignore
      const deletedElementId = space.elements[index]._id?.toString();
      space.elements.splice(index, 1);
      await space.save();
      return res.status(200).json({
        deletedElementId,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error", details: err });
    }
  }
);

export default router;
