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
const WishlistItem_1 = __importDefault(require("../models/WishlistItem"));
const router = express_1.default.Router();
// Get all wishlist items for the authenticated user
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const items = yield WishlistItem_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching wishlist items" });
    }
}));
// Add a new wishlist item
router.post("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { src, alt } = req.body;
        const item = new WishlistItem_1.default({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            src,
            alt
        });
        yield item.save();
        res.status(201).json(item);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding wishlist item" });
    }
}));
// Delete a wishlist item
router.delete("/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const item = yield WishlistItem_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        res.json({ message: "Item deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting item" });
    }
}));
exports.default = router;
