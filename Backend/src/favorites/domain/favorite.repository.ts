import Favorite from "./Favorite";
import User from "../../users/domain/User";

export default interface FavoriteRepository {
    newFavorite (favorite: Favorite): Promise<Favorite>;
    delete (favorite: Favorite): Promise<Favorite>;
}