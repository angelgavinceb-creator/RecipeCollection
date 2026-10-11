import Rating from "./Rating";

export default interface RatingRepository {
    newRating (rating: Rating): Promise<Rating>;
    delete (rating: Rating): Promise<Rating>;
}