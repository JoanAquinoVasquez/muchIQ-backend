import { User } from '../users/user.entity';
import { Place } from '../places/place.entity';
import { Dish } from '../dishes/dish.entity';

export class Review {
  id: string;
  rating: number;
  comment?: string | null;
  userId: string;
  placeId?: string | null;
  routeId?: string | null;
  dishId?: string | null;
  createdAt: Date;

  // Relaciones
  user?: User;
  place?: Place;
  dish?: Dish;

  constructor(partial: Partial<Review>) {
    Object.assign(this, partial);
  }
}
