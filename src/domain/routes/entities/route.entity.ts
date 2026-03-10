export class RouteEntity {
  id: string;
  name: string;
  description?: string;
  difficultyId: string;
  estimatedTime?: number;
  distanceKm?: number;
  metadata?: any;
  isActive: boolean;

  constructor(partial: Partial<RouteEntity>) {
    Object.assign(this, partial);
  }
}
