import { User } from '../users/user.entity';

export class Role {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  isActive: boolean;
  createdAt: Date;

  // Relaciones
  users?: User[];

  constructor(partial: Partial<Role>) {
    Object.assign(this, partial);
  }
}
