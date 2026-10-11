import User from "./User"

export default interface UserRepository {
    register (user: User): Promise<User>;
    getUserByEmail (user: User): Promise<User | null>;
}