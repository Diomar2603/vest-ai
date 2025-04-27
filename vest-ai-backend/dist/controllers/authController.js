"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const UserInformations_1 = __importDefault(require("../models/UserInformations"));
const WardrobeSection_1 = __importDefault(require("../models/WardrobeSection"));
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const emailInterno = process.env.EMAIL_INTERNO;
const senhaInterna = process.env.SENHA_EMAIL;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password, gender, phoneNumber, dressingStyle, preferredColors, clothingSize, fitPreference, age, ethnicity, hasObesity, salaryRange, hobbies, } = req.body;
        // Verifica se o usuário já existe
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "E-mail já cadastrado" });
        }
        // Hash da senha
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Criação do usuário
        const newUser = new User_1.default({
            name: fullName,
            email,
            password: hashedPassword,
            phoneNumber: phoneNumber
        });
        const newUserInformations = new UserInformations_1.default({
            UserId: newUser._id,
            dressingStyle: dressingStyle,
            preferredColors: preferredColors,
            clothingSize: clothingSize,
            fitPreference: fitPreference,
            gender: gender,
            age: age,
            ethnicity: ethnicity,
            hasObesity: hasObesity,
            salaryRange: salaryRange,
            hobbies: hobbies,
        });
        // Create default wardrobe sections
        const defaultSections = ['Camisas', 'Calças', 'Calçados', 'Acessórios'];
        const wardrobeSections = defaultSections.map(name => new WardrobeSection_1.default({
            userId: newUser._id,
            name
        }));
        yield newUser.save();
        yield newUserInformations.save();
        yield Promise.all(wardrobeSections.map(section => section.save()));
        res.status(201).json({ message: "Usuário registrado com sucesso!" });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao registrar usuário", error });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Verifica se o usuário existe
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }
        // Verifica a senha
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }
        // Gera o token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao fazer login", error });
    }
});
exports.login = login;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        var user = yield User_1.default.findOne({ email: email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const senhaPlana = crypto.randomBytes(4).toString('hex');
        const senhaHash = yield bcryptjs_1.default.hash(senhaPlana, 10);
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
        transporter.sendMail(mailOptions, function (error, info) {
            return __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    console.log('Erro ao enviar e-mail:', error);
                }
                else {
                    console.log('E-mail enviado:', info);
                    const response = yield User_1.default.updateOne({ email: email }, { password: senhaHash });
                }
            });
        });
        res.status(204);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
});
exports.resetPassword = resetPassword;
