import Category from "./Category";

export default interface CategoryRepository {
    getCategoryByName (categories: Category[]): Promise<Category[]>;
}