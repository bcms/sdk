import type { BCMSEntity } from '.';

export interface BCMSSdkCacheQuery<Item extends BCMSEntity> {
  (item: Item): boolean;
}

export type BCMSSdkCacheDataName =
  | 'apiKey'
  | 'color'
  | 'entry'
  | 'entryLite'
  | 'group'
  | 'groupLite'
  | 'language'
  | 'media'
  | 'status'
  | 'templateOrganizer'
  | 'template'
  | 'user'
  | 'widget'
  | 'tag'
  | 'parse';

export interface BCMSSdkCacheData {
  name: BCMSSdkCacheDataName;
}

export interface BCMSSdkCache {
  mutations: {
    set<Item extends BCMSEntity>(
      data: {
        payload: Item | Item[];
      } & BCMSSdkCacheData,
    ): void;
    remove<Item extends BCMSEntity>(
      data: { payload: Item | Item[] } & BCMSSdkCacheData,
    ): void;
  };
  getters: {
    items<Item extends BCMSEntity>(data: BCMSSdkCacheData): Item[];
    find<Item extends BCMSEntity>(
      data: { query: BCMSSdkCacheQuery<Item> } & BCMSSdkCacheData,
    ): Item[];
    findOne<Item extends BCMSEntity>(
      data: {
        query: BCMSSdkCacheQuery<Item>;
      } & BCMSSdkCacheData,
    ): Item | undefined;
  };
}
