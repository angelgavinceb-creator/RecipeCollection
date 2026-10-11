export default interface Rating {
    id?: number;
    userId?: number;
    recipeId?: number;
    score?: number;
    comment?: string;
    createdAt?: Date;
}