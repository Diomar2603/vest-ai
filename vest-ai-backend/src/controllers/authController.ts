import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import UserInformations, { IUserInformations } from "../models/UserInformations";

export const register = async (req: Request, res: Response) : Promise<any> => {
  try {
    const {
      fullName,
      email,
      password,
      gender,
      phoneNumber,
    
      dressingStyle,
      preferredColors,
      clothingSize,
      fitPreference,
    
      age,
      ethnicity,
      hasObesity,
      salaryRange,
      hobbies,
    } = req.body;
    

    

    // Verifica se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "E-mail já cadastrado" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criação do usuário
    const newUser: IUser = new User({
      name: fullName,
      email,
      password: hashedPassword,
    });

    const newUserInformations: IUserInformations = new UserInformations({
      UserId: newUser._id,
      dressingStyle : dressingStyle,
      preferredColors: preferredColors,
      clothingSize: clothingSize,
      fitPreference : fitPreference,
      
      phoneNumber: phoneNumber,
      gender: gender,
      age: age,
      ethnicity: ethnicity,
      hasObesity: hasObesity,
      salaryRange: salaryRange,
      hobbies: hobbies,
    });
    


    await newUser.save();
    await newUserInformations.save();

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao registrar usuário", error });
  }
};

export const login = async (req: Request, res: Response) : Promise<any> => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    // Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login", error });
  }
};
