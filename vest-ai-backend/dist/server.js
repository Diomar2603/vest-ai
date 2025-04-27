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
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = __importDefault(require("./data/connectDB"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const wardrobeRoutes_1 = __importDefault(require("./routes/wardrobeRoutes"));
const outfitRoutes_1 = __importDefault(require("./routes/outfitRoutes"));
const wishlistRoutes_1 = __importDefault(require("./routes/wishlistRoutes"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
dotenv_1.default.config();
(0, connectDB_1.default)();
const app = (0, express_1.default)();
const PORT = 5001;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
// Rotas
app.use("/api/auth", authRoutes_1.default);
app.use("/api/wardrobe", wardrobeRoutes_1.default);
app.use("/api/outfits", outfitRoutes_1.default);
app.use("/api/wishlist", wishlistRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🛑 Encerrando servidor...");
    process.exit(0);
}));
