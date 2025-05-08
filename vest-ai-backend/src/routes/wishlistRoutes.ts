import express, { Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { BaseRequest } from "../models/requests/BaseRequest";
import WishlistItem from "../models/WishlistItem";

const router = express.Router();

router.get("/", authMiddleware, async (req: BaseRequest, res: Response) => {
  try {
    const items = await WishlistItem.find({ userId: req.user?.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist items" });
  }
});

router.post("/", authMiddleware, async (req: BaseRequest, res: Response) => {
  try {
    const { src, alt } = req.body;
    const item = new WishlistItem({
      userId: req.user?.id,
      src,
      alt
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Error adding wishlist item" });
  }
});

router.delete("/:id", authMiddleware, async (req: BaseRequest, res: Response) => {
  try {
    const item = await WishlistItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id
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