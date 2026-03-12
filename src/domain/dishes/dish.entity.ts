import { Media } from '../social/media.entity';
import { Review } from '../social/review.entity';
import { Favorite } from '../social/favorite.entity';
import { PlaceDish } from '../places/place-dish.entity';

export class Dish {
  id: string;
  name: string;
  description: string;
  history?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  placeDishes?: PlaceDish[];
  media?: Media[];
  reviews?: Review[];
  favorites?: Favorite[];

  constructor(partial: Partial<Dish>) {
    Object.assign(this, partial);
  }
}
