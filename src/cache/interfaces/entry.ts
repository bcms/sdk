export interface CacheEntry<T> {
  expAt: number;
  entry: T;
}
