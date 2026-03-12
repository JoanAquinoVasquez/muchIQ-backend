import { Place } from './place.entity';
import { Dish } from '../dishes/dish.entity';

export class PlaceDish {
  id: string;
  dishId: string;
  placeId: string;
  price?: number | null;
  isSpecialty: boolean;

  // Relaciones
  dish?: Dish;
  place?: Place;

  constructor(partial: Partial<PlaceDish>) {
    Object.assign(this, partial);
  }
}
