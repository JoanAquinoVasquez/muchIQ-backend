import { Place } from '../places/place.entity';
import { Dish } from '../dishes/dish.entity';
import { User } from '../users/user.entity';

export class Media {
  id: string;
  url: string;
  caption?: string | null;
  mediaTypeId: string;
  placeId?: string | null;
  routeId?: string | null;
  rewardId?: string | null;
  dishId?: string | null;
  userId?: string | null;
  createdAt: Date;

  // Relaciones
  place?: Place;
  dish?: Dish;
  user?: User;

  constructor(partial: Partial<Media>) {
    Object.assign(this, partial);
  }
}
