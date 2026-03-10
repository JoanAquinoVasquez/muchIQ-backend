export class MediaTypeEntity {
  id: string;
  name: string;
  description?: string;
  extension?: string;

  constructor(partial: Partial<MediaTypeEntity>) {
    Object.assign(this, partial);
  }
}

export class MediaEntity {
  id: string;
  url: string;
  caption?: string;
  mediaTypeId: string;
  placeId?: string;
  routeId?: string;
  rewardId?: string;
  userId?: string;

  constructor(partial: Partial<MediaEntity>) {
    Object.assign(this, partial);
  }
}
