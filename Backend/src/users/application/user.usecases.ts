import User from "../domain/User";
import UserRepository from "../domain/user.repository";
import { hash, compare} from "../../context/security/encrypter";
import HttpError from "../../context/errors/HttpError";

export default class UserUseCases {
    constructor (private readonly userRepository: UserRepository){}

    async register (user: User): Promise<User> {
        const password = user.password ? hash(user.password) : undefined;
        return await this.userRepository.register({
            username: user.username,
            email: user.email,
            password
        })
    }

    async getUserByEmail (user: User): Promise<User | null> {
        return await this.userRepository.getUserByEmail(user);
    }

    async login (user: User): Promise<User> {
        const stored = await this.userRepository.getUserByEmail(user);

        if (!stored || !compare(user.password || "", stored.password || "")) {
            throw new HttpError(401, "Credenciales incorrectas");
        }
        return stored;
    }
    
}