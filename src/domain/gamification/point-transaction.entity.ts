import { User } from '../users/user.entity';

export class PointTransaction {
  id: string;
  amount: number;
  reason?: string | null;
  referenceId?: string | null;
  userId: string;
  createdAt: Date;

  // Relaciones
  user?: User;

  constructor(partial: Partial<PointTransaction>) {
    Object.assign(this, partial);
  }
}
