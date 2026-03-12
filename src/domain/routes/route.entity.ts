import { DifficultyLevel } from '../taxonomy/difficulty-level.entity';
import { Place } from '../places/place.entity';
import { Media } from '../social/media.entity';
import { Review } from '../social/review.entity';
import { Favorite } from '../social/favorite.entity';
import { Category } from '../taxonomy/category.entity';

export interface RouteCategory {
  id: string;
  routeId: string;
  categoryId: string;
  category?: Category;
}

export interface RoutePlace {
  id: string;
  order: number;
  notes?: string | null;
  routeId: string;
  placeId: string;
  place?: Place;
}

export class Route {
  id: string;
  name: string;
  description?: string | null;
  difficultyId: string;
  estimatedTime?: number | null;
  distanceKm?: number | null;
  metadata?: Record<string, unknown> | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  difficulty?: DifficultyLevel;
  categories?: RouteCategory[];
  places?: RoutePlace[];
  media?: Media[];
  reviews?: Review[];
  favorites?: Favorite[];

  constructor(partial: Partial<Route>) {
    Object.assign(this, partial);
  }
}
