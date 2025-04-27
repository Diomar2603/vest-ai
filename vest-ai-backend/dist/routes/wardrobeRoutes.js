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
const WardrobeItem_1 = __importDefault(require("../models/WardrobeItem"));
const WardrobeSection_1 = __importDefault(require("../models/WardrobeSection"));
const router = express_1.default.Router();
router.get("/sections", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sections = yield WardrobeSection_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        res.json(sections);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching wardrobe sections" });
    }
}));
router.put("/sections", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { sections } = req.body;
        const currentSections = yield WardrobeSection_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        console.log("current-sections" + currentSections);
        console.log(req.body);
        console.log(sections);
        for (const currentSection of currentSections) {
            const stillExists = sections.some(s => s._id === currentSection._id.toString());
            if (!stillExists) {
                const hasItems = yield WardrobeItem_1.default.exists({ section: currentSection._id });
                if (hasItems) {
                    res.status(400).json({
                        message: "Não é possível excluir uma seção que contém itens"
                    });
                    return;
                }
            }
        }
        const updatedSections = yield Promise.all(sections.map((section) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (section._id.startsWith('section-')) {
                const newSection = new WardrobeSection_1.default({
                    name: section.name,
                    userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
                });
                return yield newSection.save();
            }
            else {
                return yield WardrobeSection_1.default.findOneAndUpdate({ _id: section._id, userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id }, { name: section.name }, { new: true });
            }
        })));
        const currentSectionIds = currentSections.map(s => s._id.toString());
        const updatedSectionIds = sections
            .filter(s => !s._id.startsWith('section-'))
            .map(s => s._id);
        const sectionsToDelete = currentSectionIds.filter(id => !updatedSectionIds.includes(id));
        if (sectionsToDelete.length > 0) {
            yield WardrobeSection_1.default.deleteMany({
                userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                _id: { $in: sectionsToDelete }
            });
            console.log("deletar" + sectionsToDelete);
        }
        res.json(updatedSections);
    }
    catch (error) {
        console.error('Error updating sections:', error);
        res.status(500).json({ message: "Error updating wardrobe sections" });
    }
}));
// Get all wardrobe items for the authenticated user
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const items = yield WardrobeItem_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching wardrobe items" });
    }
}));
// Add a new wardrobe item
router.post("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { section, src, alt } = req.body;
        const x = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log({ section, src, alt, x });
        const item = new WardrobeItem_1.default({
            userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            section,
            src,
            alt: alt == '' ? 'image' : alt,
        });
        yield item.save();
        res.status(201).json(item);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding wardrobe item" });
    }
}));
// Delete a wardrobe item
router.delete("/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const item = yield WardrobeItem_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        });
        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        res.status(200).json({ message: "Item deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting item" });
    }
}));
exports.default = router;
