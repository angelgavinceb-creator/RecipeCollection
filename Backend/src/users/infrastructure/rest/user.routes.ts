import UserRepositoryPostgres from "../db/user.postgres";
import User from "../../domain/User";
import UserUseCases from "../../application/user.usecases";
import HttpError from "../../../context/errors/HttpError";
import { createToken, isAuth } from "../../../context/security/auth";
import express, { Router, Request, Response} from "express";

const router: Router = express.Router();
const userUseCases = new UserUseCases(new UserRepositoryPostgres);

// Los límites coinciden con las columnas de la tabla users (varchar(30))
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Devuelve un mensaje de error, o null si los datos son válidos
function validateRegister(username: unknown, email: unknown, password: unknown): string | null {
    if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") {
        return "Faltan datos para el registro";
    }
    if (username.trim().length < 1 || username.trim().length > 30) {
        return "El nombre de usuario debe tener entre 1 y 30 caracteres";
    }
    if (email.trim().length > 30) {
        return "El email no puede superar los 30 caracteres";
    }
    if (!EMAIL_REGEX.test(email.trim())) {
        return "El email no tiene un formato válido";
    }
    // bcrypt solo tiene en cuenta los primeros 72 caracteres de la contraseña
    if (password.length < 6 || password.length > 72) {
        return "La contraseña debe tener entre 6 y 72 caracteres";
    }
    return null;
}

router.post("/signin", async (req: Request, res: Response) => {
    const { username, email, password } = req.body ?? {};

    const validationError = validateRegister(username, email, password);
    if (validationError) throw new HttpError(400, validationError);

    const newUser: User = {
        username: username.trim(),
        email: email.trim(),
        password
    };

    try {
        const response = await userUseCases.register(newUser);
        return res.status(201).json(response);
    } catch (error: any) {
        // 23505 = violación de restricción unique (el email ya existe)
        if (error?.code === "23505") throw new HttpError(409, "Ya existe una cuenta con ese email");
        throw error;
    }
});

router.post("/login", async (req:Request, res: Response) => {
    const user: User = {
        email: req.body?.email,
        password: req.body?.password
    };
    const response = await userUseCases.login(user);
    const token = createToken(response);
    return res.status(200).json({
        user: {
            id: response.id,
            username: response.username,
            email: response.email,
            createdAt: response.createdAt
        },
        token
    });
});

router.get("/getUserByEmail", isAuth, async (req:Request, res: Response) => {
    const user: User = {
        email: req.body.user.email
    };
    const found = await userUseCases.getUserByEmail(user);
    if (!found) throw new HttpError(404, "Usuario no encontrado");

    const { password, ...userWithoutPassword } = found;
    return res.status(200).json(userWithoutPassword);
});

export default router;