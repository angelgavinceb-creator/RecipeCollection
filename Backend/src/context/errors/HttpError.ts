// Error con código HTTP. Se lanza con "throw" y errorHandler lo convierte en respuesta.
export default class HttpError extends Error {
    constructor(public readonly status: number, message: string) {
        super(message);
        this.name = "HttpError";
    }
}