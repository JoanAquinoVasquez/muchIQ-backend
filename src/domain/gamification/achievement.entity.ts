export class Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  points: number;
  criteria?: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: Date;

  constructor(partial: Partial<Achievement>) {
    Object.assign(this, partial);
  }
}
