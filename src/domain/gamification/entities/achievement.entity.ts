export class AchievementEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public points: number,
    public isActive: boolean,
    public criteria: any | null,
    public icon: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(data: {
    name: string;
    description: string;
    points?: number;
    isActive?: boolean;
    criteria?: any;
    icon?: string;
  }): AchievementEntity {
    return new AchievementEntity(
      '', // Asignado por DB
      data.name,
      data.description,
      data.points ?? 0,
      data.isActive ?? true,
      data.criteria ?? null,
      data.icon ?? null,
      new Date(), // Asignado por DB
    );
  }
}
