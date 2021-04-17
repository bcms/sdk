import type { BCMSSdkCacheEntity, BCMSSdkCacheEntityItem } from './entity';

export interface BCMSSdkCacheHandlerPrototype<
  T extends BCMSSdkCacheEntityItem
> {
  cache: Array<BCMSSdkCacheEntity<T>>;
  get(id: string): T | null;
  getAll(): T[];
  find(query: (e: BCMSSdkCacheEntity<T>) => boolean): T[];
  findOne(query: (e: BCMSSdkCacheEntity<T>) => boolean): T | null;
  getMany(ids: string[]): T[];
  set(entity: T): void;
  remove(id: string): void;
  clear(): void;
}
