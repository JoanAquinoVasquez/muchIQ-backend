export class MediaTypeNotFoundException extends Error {
  constructor(id: string) {
    super(`Media Type with id ${id} not found`);
    this.name = 'MediaTypeNotFoundException';
  }
}

export class MediaNotFoundException extends Error {
  constructor(id: string) {
    super(`Media with id ${id} not found`);
    this.name = 'MediaNotFoundException';
  }
}
