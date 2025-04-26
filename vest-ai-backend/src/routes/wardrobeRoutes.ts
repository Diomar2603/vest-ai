import express, { Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import WardrobeItem, { IWardrobeItem } from "../models/WardrobeItem";
import WardrobeSection from "../models/WardrobeSection";
import IWardrobeSection from "../models/WardrobeSection";
import { Document } from 'mongoose';

const router = express.Router();

router.get("/sections", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const sections = await WardrobeSection.find({ userId: req.user?.id });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wardrobe sections" });
  }
});


router.put("/sections", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { sections } = req.body as { sections: Array<{ _id: string; name: string }> };
    const currentSections = await WardrobeSection.find({ userId: req.user?.id });

    console.log("current-sections" + currentSections)
    console.log(req.body)
    console.log(sections)
    

    for (const currentSection of currentSections) {
      const stillExists = sections.some(s => s._id === currentSection._id.toString());
      if (!stillExists) {

        const hasItems = await WardrobeItem.exists({ section: currentSection._id });
        if (hasItems) {
          res.status(400).json({ 
            message: "Não é possível excluir uma seção que contém itens" 
          });
          return;
        }
      }
    }


    const updatedSections = await Promise.all(sections.map(async section => {
      if (section._id.startsWith('section-')) {

        const newSection = new WardrobeSection({
          name: section.name,
          userId: req.user?.id
        });
        return await newSection.save();
      } else {

        return await WardrobeSection.findOneAndUpdate(
          { _id: section._id, userId: req.user?.id },
          { name: section.name },
          { new: true }
        );
      }
    }));

    const currentSectionIds = currentSections.map(s => s._id.toString());
    const updatedSectionIds = sections
      .filter(s => !s._id.startsWith('section-'))
      .map(s => s._id);
    
    const sectionsToDelete = currentSectionIds.filter(id => !updatedSectionIds.includes(id));
    
    if (sectionsToDelete.length > 0) {
      
      await WardrobeSection.deleteMany({
        userId: req.user?.id,
        _id: { $in: sectionsToDelete }
      });

      console.log("deletar" + sectionsToDelete)
    }

    res.json(updatedSections);
  } catch (error) {
    console.error('Error updating sections:', error);
    res.status(500).json({ message: "Error updating wardrobe sections" });
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

    const x = req.user?.id;
    console.log({ section, src, alt, x });

    const item = new WardrobeItem({
      userId: req.user?.id,
      section,
      src,
      alt : alt == '' ? 'image' : alt,
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
      userId: req.user?.id
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