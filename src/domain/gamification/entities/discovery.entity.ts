export class DiscoveryEntity {
  constructor(
    public readonly id: string,
    public userId: string,
    public placeId: string,
    public points: number,
    public readonly createdAt: Date,
  ) {}

  static create(data: {
    userId: string;
    placeId: string;
    points?: number;
  }): DiscoveryEntity {
    return new DiscoveryEntity(
      '',
      data.userId,
      data.placeId,
      data.points ?? 10, // Defecto según schema
      new Date(),
    );
  }
}
