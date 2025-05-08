import express, { Request, Response } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { BaseRequest } from "../models/requests/BaseRequest";
import UserInformation from "../models/UserInformations";
import { Types } from 'mongoose';
import { userInfo } from "os";

interface ChatMessage extends Request {
  message: string;
  userId: string;
}

const router = express.Router();

router.post("/message",  authMiddleware, async (req, res: Response): Promise<void> => {
  try {
    const { message, userId } = req.body;

    console.log(req.body)
    console.log(userId)

    const userObjectId = new Types.ObjectId(userId);

    console.log(userObjectId)

    const user = await UserInformation.findOne({UserId: userObjectId});

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const payload = {
      user_message: message,
      dressingStyle: user.dressingStyle,
      preferredColors: user.preferredColors,
      gender: user.gender,
      clothingSize: user.clothingSize,
      fitPreference: user.fitPreference,
      age: user.age,
      ethnicity: user.ethnicity,
      hasObesity: user.hasObesity,
      hobbies: user.hobbies,
      salaryRange: user.salaryRange
    };

    const response = await fetch(`${process.env.LLM_ROUTE}/vestAi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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