import express, { Request, Response } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

const router = express.Router();

// 🔐 Rota protegida que retorna informações do usuário autenticado
router.get("/", authMiddleware, (req: AuthRequest, res: Response) => {
    res.json({
        message: "✅ Acesso autorizado!",
        user: req.user, // Agora `req.user` é reconhecido corretamente
    });
});

export default router;