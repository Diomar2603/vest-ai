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
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserInformations_1 = __importDefault(require("../models/UserInformations"));
const router = express_1.default.Router();
router.get("/credentials", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne({ _id: req.user.id }).lean();
        const userInformations = yield UserInformations_1.default.findOne({ UserId: req.user.id }).lean();
        if (!user || !userInformations) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userProfile = {
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
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
}));
router.post("/updateCredentials", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { fullName, email, phoneNumber, } = req.body;
        const user = yield User_1.default.updateOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, { name: fullName, email: email, phoneNumber: phoneNumber });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
}));
router.post("/updatePersonalInformations", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { age, gender, ethnicity, hasObesity, salaryRange } = req.body;
        const user = yield UserInformations_1.default.updateOne({ UserId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, { age: age, gender: gender, ethnicity: ethnicity, hasObesity: hasObesity, salaryRange: salaryRange });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
}));
router.post("/updateFashionInformations", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { dressingStyle, preferredColors, hobbies, clothingSize, fitPreference } = req.body;
        const user = yield UserInformations_1.default.updateOne({ UserId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, { dressingStyle: dressingStyle, preferredColors: preferredColors,
            hobbies: hobbies, clothingSize: clothingSize, fitPreference: fitPreference });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
}));
router.post("/updatePassword", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { oldPassword, newPassword } = req.body;
        var oldUser = yield User_1.default.findOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        if (!oldUser) {
            res.status(400).json({ message: "Usuario não existe mais" });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, oldUser.password);
        if (isMatch) {
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
            const user = yield User_1.default.updateOne({ _id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id }, { password: hashedPassword });
            res.json(user);
        }
        else {
            res.status(404).json({ message: "A senha informada é invalida, não foi possivel atualizar a senha" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
}));
exports.default = router;
