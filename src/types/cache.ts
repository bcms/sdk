import type { BCMSEntity } from './models';

export interface BCMSSdkCacheQuery<Item extends BCMSEntity> {
  (item: Item): boolean;
}

export const BCMSSdkCacheDataNames = [
  'apiKey',
  'color',
  'entry',
  'entryLite',
  'group',
  'groupLite',
  'language',
  'media',
  'status',
  'templateOrganizer',
  'template',
  'user',
  'widget',
  'tag',
];
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
  | 'tag';

export interface BCMSSdkCacheData {
  name: BCMSSdkCacheDataName;
}

export interface BCMSSdkCacheConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fromVuex?: any;
  custom?: BCMSSdkCache;
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