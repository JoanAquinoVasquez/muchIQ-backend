import { PlaceDish } from './place-dish.entity';
import { Category } from '../taxonomy/category.entity';

export interface PlaceCategory {
  id: string;
  placeId: string;
  categoryId: string;
  category?: Category;
}

export class Place {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  district?: string | null;
  city?: string | null;
  country?: string | null;
  metadata?: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  categories?: PlaceCategory[];
  placeDishes?: PlaceDish[];

  constructor(partial: Partial<Place>) {
    Object.assign(this, partial);
  }
}
