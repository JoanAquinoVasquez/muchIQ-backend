export class RewardNotFoundException extends Error {
  constructor(id: string) {
    super(`Reward with id ${id} not found`);
    this.name = 'RewardNotFoundException';
  }
}

export class RewardOutOfStockException extends Error {
  constructor(id: string) {
    super(`Reward with id ${id} is out of stock`);
    this.name = 'RewardOutOfStockException';
  }
}
