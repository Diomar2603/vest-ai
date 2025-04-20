import express, { Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/message", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;

    // incluir os dados do usuario pegando do banco
    const response = await fetch('http://localhost:5000/vestAi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from AI service');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ message: "Error processing message" });
  }
});

export default router;