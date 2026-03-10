export class AchievementNotFoundException extends Error {
  constructor(id: string) {
    super(`Achievement with id ${id} not found`);
    this.name = 'AchievementNotFoundException';
  }
}

export class InvalidAchievementDataException extends Error {
  constructor(message: string) {
    super(`Invalid achievement data: ${message}`);
    this.name = 'InvalidAchievementDataException';
  }
}
