import express, { Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/User";
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get("/credentials", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ _id: req.user?.id });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

router.post("/updateCredentials", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
    } = req.body;

    const user = await User.updateOne({ _id: req.user?.id },{name:fullName, email:email, phoneNumber:phoneNumber});
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

router.post("/updatePassword", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      oldPassword,
      newPassword
    } = req.body;

    var oldUser = await User.findOne({_id : req.user?.id});
    if (!oldUser) {
      res.status(400).json({ message: "Usuario não existe mais" });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, oldUser.password);

    if(isMatch){
      const hashedPassword = await bcrypt.hash(newPassword, 10);
    
      const user = await User.updateOne({ _id: req.user?.id },{password:hashedPassword});
      res.json(user);
    }
    else{
      res.status(404).json({ message: "A senha informada é invalida, não foi possivel atualizar a senha" });
    }

    
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

export default router;