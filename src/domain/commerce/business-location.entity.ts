import { Company } from './company.entity';
import { Reward } from './reward.entity';

export class BusinessLocation {
  id: string;
  name: string;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  district?: string | null;
  city?: string | null;
  country?: string | null;
  isActive: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  company?: Company;
  rewards?: Reward[];

  constructor(partial: Partial<BusinessLocation>) {
    Object.assign(this, partial);
  }
}
