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
const UserInformations_1 = __importDefault(require("../models/UserInformations"));
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
router.post("/message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, userId } = req.body;
        console.log(req.body);
        console.log(userId);
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        console.log(userObjectId);
        const user = yield UserInformations_1.default.findOne({ UserId: userObjectId });
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
        const response = yield fetch('http://localhost:5000/vestAi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error('Failed to get response from AI service');
        }
        const data = yield response.json();
        res.json(data);
    }
    catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ message: "Error processing message" });
    }
}));
exports.default = router;
