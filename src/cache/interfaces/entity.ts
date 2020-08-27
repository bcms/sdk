export interface CacheEntity<T> {
  expAt: number;
  entity: T;
}
