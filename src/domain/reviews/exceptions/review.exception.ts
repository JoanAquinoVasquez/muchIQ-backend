export class ReviewNotFoundException extends Error {
  constructor(id: string) {
    super(`Review with id ${id} not found`);
    this.name = 'ReviewNotFoundException';
  }
}

export class InvalidReviewTargetException extends Error {
  constructor() {
    super(`A review must have either a placeId or a routeId`);
    this.name = 'InvalidReviewTargetException';
  }
}

export class InvalidRatingException extends Error {
  constructor(rating: number) {
    super(`Rating ${rating} is invalid. It must be between 1 and 5`);
    this.name = 'InvalidRatingException';
  }
}
