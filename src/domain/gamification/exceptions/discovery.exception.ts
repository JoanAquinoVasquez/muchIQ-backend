export class DiscoveryNotFoundException extends Error {
  constructor(id: string) {
    super(`Discovery with id ${id} not found`);
    this.name = 'DiscoveryNotFoundException';
  }
}

export class DuplicateDiscoveryException extends Error {
  constructor(userId: string, placeId: string) {
    super(`User ${userId} already discovered place ${placeId}`);
    this.name = 'DuplicateDiscoveryException';
  }
}
