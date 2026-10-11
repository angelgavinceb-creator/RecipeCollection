import { NextFunction, Request, Response } from "express";
import HttpError from "./HttpError";
import Message from "../responses/Message";

// Errores conocidos de PostgreSQL (error.code) y cómo explicarlos al cliente
const POSTGRES_ERRORS: Record<string, { status: number; text: string }> = {
    "23505": { status: 409, text: "Ese registro ya existe" },
    "23503": { status: 400, text: "Se hace referencia a un dato que no existe" },
    "23514": { status: 400, text: "Algún valor está fuera del rango permitido" },
    "22001": { status: 400, text: "Algún texto es demasiado largo" },
    "22P02": { status: 400, text: "Algún dato no tiene el formato correcto" },
};

// Express reconoce un manejador de errores porque tiene exactamente 4 parámetros
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let status = 500;
    let text = "Error interno del servidor";

    if (err instanceof HttpError) {
        status = err.status;
        text = err.message;
    } else if (err?.type === "entity.parse.failed") {
        // El cuerpo de la petición no era un JSON válido
        status = 400;
        text = "El cuerpo de la petición no es un JSON válido";
    } else if (err?.code && POSTGRES_ERRORS[err.code]) {
        status = POSTGRES_ERRORS[err.code].status;
        text = POSTGRES_ERRORS[err.code].text;
    }

    // Solo los errores inesperados se guardan en el log del servidor
    if (status === 500) console.error(err);

    const message: Message = { text };
    res.status(status).json(message);
};

export default errorHandler;