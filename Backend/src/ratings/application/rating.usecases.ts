import Rating from "../domain/Rating";
import RatingRepository from "../domain/rating.repository";

export default class RatingUseCases {
    constructor (private readonly ratingRepository: RatingRepository){}

    async newRating (rating: Rating): Promise<Rating>{
        return await this.ratingRepository.newRating(rating);
    }

    async delete (rating: Rating): Promise<Rating>{
        return await this.ratingRepository.delete(rating);
    }
}