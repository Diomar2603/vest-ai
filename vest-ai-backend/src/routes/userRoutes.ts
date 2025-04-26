import express, { Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/User";
import bcrypt from 'bcryptjs';
import UserInformations from "../models/UserInformations";
import { UserProfileDTO } from "../dto/UserDto";

const router = express.Router();

router.get("/credentials", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ _id: req.user.id }).lean();
    const userInformations = await UserInformations.findOne({ UserId: req.user.id }).lean();

    if (!user || !userInformations) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userProfile: UserProfileDTO = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      preference: {
        gender: userInformations.gender,
        dressingStyle: userInformations.dressingStyle,
        preferredColors: userInformations.preferredColors,
        clothingSize: userInformations.clothingSize,
        fitPreference: userInformations.fitPreference,
        age: userInformations.age,
        ethnicity: userInformations.ethnicity,
        hasObesity: userInformations.hasObesity,
        salaryRange: userInformations.salaryRange,
        hobbies: userInformations.hobbies,
      },
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user:", error);
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

router.post("/updatePersonalInformations", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      age,
      gender,
      ethnicity,
      hasObesity,
      salaryRange
    } = req.body;

    const user = await UserInformations.updateOne({ UserId: req.user?.id },{age:age, gender:gender, ethnicity:ethnicity,hasObesity:hasObesity,salaryRange:salaryRange});
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

router.post("/updateFashionInformations", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const {
      dressingStyle,
      preferredColors,
      hobbies,
      clothingSize,
      fitPreference
    } = req.body;

    const user = await UserInformations.updateOne({ UserId: req.user?.id },{dressingStyle:dressingStyle, preferredColors:preferredColors, 
      hobbies:hobbies,clothingSize:clothingSize,fitPreference:fitPreference});
      
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