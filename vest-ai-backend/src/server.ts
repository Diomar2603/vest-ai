import express from "express";
import dotenv from "dotenv";
import connectDB from "./data/connectDB";
import authRoutes from "./routes/authRoutes";

dotenv.config();
connectDB();

const app = express();
const PORT = 5000;

app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});

// 

process.on("SIGINT", async () => {
  console.log("🛑 Encerrando servidor...");
  process.exit(0);
});