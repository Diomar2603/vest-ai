import express from "express";
import dotenv from "dotenv";
import connectDB from "./data/connectDB";
import authRoutes from "./routes/authRoutes";
import wardrobeRoutes from "./routes/wardrobeRoutes";
import outfitRoutes from "./routes/outfitRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const PORT = 5001;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/wardrobe", wardrobeRoutes)
app.use("/api/outfits", outfitRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("🛑 Encerrando servidor...");
  process.exit(0);
});