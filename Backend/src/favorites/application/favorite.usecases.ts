import Favorite from "../domain/Favorite";
import FavoriteRepository from "../domain/favorite.repository";

export default class FavoriteUseCases {
    constructor (private readonly favoriteReporitory: FavoriteRepository){}

    async newFavorite (favorite: Favorite): Promise<Favorite> {
        return await this.favoriteReporitory.newFavorite(favorite);
    }

    async delete (favorite: Favorite): Promise<Favorite> {
        return await this.favoriteReporitory.delete(favorite);
    }
}