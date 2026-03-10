export class DifficultyLevelEntity {
  id: string;
  name: string;
  description?: string;
  color?: string;
  order: number;

  constructor(partial: Partial<DifficultyLevelEntity>) {
    Object.assign(this, partial);
  }
}
