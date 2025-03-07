import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para permitir JSON
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API com Express e TypeScript funcionando!");
});

app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
