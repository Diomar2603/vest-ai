import express, { Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import WardrobeItem from "../models/WardrobeItem";
import WardrobeSection from "../models/WardrobeSection";

const router = express.Router();

router.get("/sections", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.user);
    console.log(req.user?.id);

    const sections = await WardrobeSection.find({ userId: req.user?.id });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wardrobe sections" });
  }
});

// Get all wardrobe items for the authenticated user
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const items = await WardrobeItem.find({ userId: req.user?.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wardrobe items" });
  }
});

// Add a new wardrobe item
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { section, src, alt } = req.body;

    console.log({ section, src, alt });

    const item = new WardrobeItem({
      userId: req.user?.id,
      section,
      src,
      alt
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error adding wardrobe item" });
  }
});

// Delete a wardrobe item
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const item = await WardrobeItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id
    });
    
    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

export default router;