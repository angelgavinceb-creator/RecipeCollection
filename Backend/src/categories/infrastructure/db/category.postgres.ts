import Category from "../../domain/Category";
import CategoryRepository from "../../domain/category.repository";
import {pool} from "../../../context/db/postgres.db";

export default class CategoryRepositoryPostgres implements CategoryRepository {
    async getCategoryByName (categories: Category[]): Promise<Category[]> {
        const result = await pool.query(
            `select * from categories where name = any($1)`,
            [categories.map((c) => c.name)]
        );
        const categoriesReturn: Category[] = result.rows.map((c) => ({id: c.id}));
        return categoriesReturn;
    }
}