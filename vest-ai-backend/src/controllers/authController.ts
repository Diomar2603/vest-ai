import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import UserInformations, { IUserInformations } from "../models/UserInformations";
import WardrobeSection from "../models/WardrobeSection";
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const emailInterno = process.env.EMAIL_INTERNO;
const senhaInterna = process.env.SENHA_EMAIL;

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
      phoneNumber: phoneNumber
    });

    const newUserInformations: IUserInformations = new UserInformations({
      UserId: newUser._id,
      dressingStyle : dressingStyle,
      preferredColors: preferredColors,
      clothingSize: clothingSize,
      fitPreference : fitPreference,
      
      gender: gender,
      age: age,
      ethnicity: ethnicity,
      hasObesity: hasObesity,
      salaryRange: salaryRange,
      hobbies: hobbies,
    });

    // Create default wardrobe sections
    const defaultSections = ['Camisas', 'Calças', 'Calçados', 'Acessórios'];
    const wardrobeSections = defaultSections.map(name => new WardrobeSection({
      userId: newUser._id,
      name
    }));

    await newUser.save();
    await newUserInformations.save();
    await Promise.all(wardrobeSections.map(section => section.save()));

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

export const resetPassword = async (req: Request, res: Response) : Promise<any> => {
  try {
    const {
      email
    } = req.body;

    var user = await User.findOne({email : email});

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const senhaPlana = crypto.randomBytes(4).toString('hex');

    const senhaHash = await bcrypt.hash(senhaPlana, 10);

    console.log('Senha gerada:', senhaPlana);
    console.log('Hash da senha:', senhaHash);

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
          user: 'juston.stoltenberg74@ethereal.email',
          pass: '6yf21rn5mRDWxrZBNP'
      }
    });
    

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #4CAF50;">Olá, ${user.name}!</h2>
        <p>Olá! Esqueceu sua senha?.</p>
        <p><strong>Aqui estão os seus novos dados de acesso:</strong></p>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Senha:</strong> <span style="background: #f2f2f2; padding: 5px 10px; border-radius: 5px;">${senhaPlana}</span></li>
        </ul>
        <p>Caso esta alteração não tenha sido gerada pelo usuario favor entrar em contato com o Email: <strong>${emailInterno}</strong> .</p>
        <p>Por favor, altere sua senha após o primeiro login para garantir sua segurança.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 0.9em; color: #999;">Este é um e-mail automático, por favor, não responda.</p>
      </div>
    `;

    const mailOptions = {
      from: emailInterno,
      to: user.email,
      subject: 'Recuperação de senha!',
      html: htmlTemplate
    };

    transporter.sendMail(mailOptions, async function(error: any, info: { response: any; }){
      if (error) {
        console.log('Erro ao enviar e-mail:', error);
      } else {
        console.log('E-mail enviado:', info);
        const response = await User.updateOne({email : email},{password:senhaHash});
      }
    });
    res.status(204);
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};