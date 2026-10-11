import User from "../../domain/User";
import UserRepository from "../../domain/user.repository";
import { pool } from "../../../context/db/postgres.db";

export default class UserRepositoryPostgres implements UserRepository {

    async register (user: User): Promise<User> {
        const result = await pool.query(
            `insert into users (username, email, password)
            values ($1, $2, $3)
            returning *`,
            [user.username, user.email, user.password]
        );
        const row = result.rows[0];
        const userReturn: User = {
            id: row.id,
            username:row.username,
            email: row.email,
            createdAt: row.created_at
        }
        return userReturn;
    }

    async getUserByEmail (user: User): Promise<User | null> {
        const result = await pool.query(
            `select * from users where email = $1`, 
            [user.email]
        )
        const row = result.rows[0];
        if (!row) return null;
        const userReturn : User = {
            id: row.id,
            username:row.username,
            email: row.email,
            createdAt: row.created_at,
            password: row.password
        }
        return userReturn;
    }
}