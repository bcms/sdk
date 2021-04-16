export interface BCMSStorage {
  get<T>(key: string): T;
  set(key: string, value: unknown): Promise<boolean>;
  remove(key: string): Promise<boolean>;
  subscribe?<T>(
    key: string,
    handler: (value: T, type: 'set' | 'remove') => void | Promise<void>,
  ): () => void;
}
export interface BCMSLocalStorageWrapper {
  all<T>(): T;
  getItem(key: string): string;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export interface BCMSStoragePrototype {

}
