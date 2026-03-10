export class RouteNotFoundException extends Error {
  constructor(id: string) {
    super(`Route with id ${id} not found`);
    this.name = 'RouteNotFoundException';
  }
}
