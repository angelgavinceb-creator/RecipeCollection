import Category from "../domain/Category";
import CategoryRepository from "../domain/category.repository";

export default class CategoryUseCases {
    constructor (private readonly categoryRepository: CategoryRepository){}

    async getCategoriesByName (categories: Category[]): Promise<Category[]> {
        return await this.categoryRepository.getCategoryByName(categories);
    }
}