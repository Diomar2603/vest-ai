import express, { Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import WishlistItem from "../models/WishlistItem";

const router = express.Router();

// Get all wishlist items for the authenticated user
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const items = await WishlistItem.find({ userId: req.user?._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist items" });
  }
});

// Add a new wishlist item
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { src, alt } = req.body;
    const item = new WishlistItem({
      userId: req.user?._id,
      src,
      alt
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error adding wishlist item" });
  }
});

// Delete a wishlist item
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const item = await WishlistItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id
    });

    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }
    
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

export default router;