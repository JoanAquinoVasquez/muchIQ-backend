import { Route } from '../routes/route.entity';

export class DifficultyLevel {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  order: number;

  // Relaciones
  routes?: Route[];

  constructor(partial: Partial<DifficultyLevel>) {
    Object.assign(this, partial);
  }
}
