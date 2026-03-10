export class RewardEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public cost: number,
    public stock: number,
    public isActive: boolean,
    public companyId: string | null,
    public businessLocationId: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(data: {
    name: string;
    description?: string;
    cost: number;
    stock?: number;
    isActive?: boolean;
    companyId?: string;
    businessLocationId?: string;
  }): RewardEntity {
    return new RewardEntity(
      '', 
      data.name,
      data.description ?? null,
      data.cost,
      data.stock ?? -1,
      data.isActive ?? true,
      data.companyId ?? null,
      data.businessLocationId ?? null,
      new Date(),
    );
  }
}
