export class ReviewEntity {
  constructor(
    public readonly id: string,
    public rating: number,
    public comment: string | null,
    public userId: string,
    public placeId: string | null,
    public routeId: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(data: {
    rating: number;
    comment?: string;
    userId: string;
    placeId?: string;
    routeId?: string;
  }): ReviewEntity {
    return new ReviewEntity(
      '',
      data.rating,
      data.comment ?? null,
      data.userId,
      data.placeId ?? null,
      data.routeId ?? null,
      new Date(),
    );
  }
}
