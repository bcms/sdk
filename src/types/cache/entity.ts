export interface BCMSSdkCacheEntityItem {
  _id: string;
}
export interface BCMSSdkCacheEntity<T> {
  item: T & BCMSSdkCacheEntityItem;
}
