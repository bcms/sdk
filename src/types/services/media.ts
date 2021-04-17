import type { BCMSMedia, BCMSMediaAggregate } from '../models';

export interface BCMSSdkMediaServicePrototype {
  aggregate(media: BCMSMedia, allMedia: BCMSMedia[]): BCMSMediaAggregate;
  aggregateFromRoot(media: BCMSMedia[]): BCMSMediaAggregate[];
}
