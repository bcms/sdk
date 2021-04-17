import type { BCMSMedia, BCMSMediaAggregate } from '../models';

export interface BCMSSdkMediaServicePrototype {
  getChildren(
    parenId: string,
    allMedia: BCMSMedia[],
    depth?: number,
  ): BCMSMedia[];
  aggregate(media: BCMSMedia, allMedia: BCMSMedia[]): BCMSMediaAggregate;
  aggregateFromRoot(media: BCMSMedia[]): BCMSMediaAggregate[];
}
