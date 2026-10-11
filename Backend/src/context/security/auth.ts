import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../users/domain/User";
import HttpError from "../errors/HttpError";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY || SECRET_KEY.length < 16) {
    throw new Error("SECRET_KEY no definida o demasiado corta (mínimo 16 caracteres). Revisa Backend/.env");
}

const createToken = (user: User) : string => {
    const payLoad = {
        user : {
            id: user.id,
            email: user.email
        }
    };
    return jwt.sign(payLoad, SECRET_KEY, {expiresIn: "1d"});
};

const isAuth = (req: Request, response: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token: string | undefined = authHeader && authHeader.split(" ")[1];
        if (!token) throw new HttpError(401, "No has iniciado sesión");

        const decoded: any = jwt.verify(token, SECRET_KEY);
        if(!req.body) req.body= {};
        req.body.user = decoded.user;
        next();
    } catch (err) {
        // Token ausente, mal formado o caducado
        next(err instanceof HttpError ? err : new HttpError(401, "Sesión no válida o caducada"));
    }
};

export {createToken, isAuth};