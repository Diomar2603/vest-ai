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
const Outfit_1 = __importDefault(require("../models/Outfit"));
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const outfits = yield Outfit_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        res.json(outfits);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching outfits" });
    }
}));
router.post("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, items } = req.body;
        const outfit = new Outfit_1.default({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            name,
            items
        });
        yield outfit.save();
        res.status(201).json(outfit);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating outfit" });
    }
}));
router.delete("/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const outfit = yield Outfit_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        });
        if (!outfit) {
            res.status(404).json({ message: "Outfit not found" });
            return;
        }
        res.json({ message: "Outfit deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting outfit" });
    }
}));
exports.default = router;
