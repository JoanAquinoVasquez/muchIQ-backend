import { Reward } from './reward.entity';
import { BusinessLocation } from './business-location.entity';

export class Company {
  id: string;
  name: string;
  ruc?: string | null;
  description?: string | null;
  logo?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  rewards?: Reward[];
  businessLocations?: BusinessLocation[];

  constructor(partial: Partial<Company>) {
    Object.assign(this, partial);
  }
}
