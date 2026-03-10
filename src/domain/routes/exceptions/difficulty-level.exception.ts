export class DifficultyLevelNotFoundException extends Error {
  constructor(id: string) {
    super(`Difficulty Level with id ${id} not found`);
    this.name = 'DifficultyLevelNotFoundException';
  }
}
