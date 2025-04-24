import express, { Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import Outfit from "../models/Outfit";

const router = express.Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const outfits = await Outfit.find({ userId: req.user?.id });
    res.json(outfits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching outfits" });
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, items } = req.body;

    const outfit = new Outfit({
      userId: req.user?.id,
      name,
      items
    });
    await outfit.save();
    res.status(201).json(outfit);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating outfit" });
  }
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const outfit = await Outfit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id
    });

    if (!outfit) {
      res.status(404).json({ message: "Outfit not found" });
      return;
    }

    res.json({ message: "Outfit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting outfit" });
  }
});

export default router;