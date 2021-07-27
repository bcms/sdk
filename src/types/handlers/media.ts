import type { SendFunction } from '../main';
import type { BCMSMedia } from '../models';
import type { BCMSStore } from '../store';

export interface BCMSMediaHandlerConfig {
  send: SendFunction;
  store: BCMSStore;
}

export interface BCMSMediaHandler {
  getAll(): Promise<BCMSMedia[]>;
  getAllByParentId(id: string, skipCache?: boolean): Promise<BCMSMedia[]>;
  getMany(ids: string[], skipCache?: boolean): Promise<BCMSMedia[]>;
  getById(id: string, skipCache?: boolean): Promise<BCMSMedia>;
  getBinary(id: string, size?: 'small'): Promise<Buffer>;
  createFile(data: {
    file: File;
    parentId?: string;
    onProgress?(event: unknown): void;
  }): Promise<BCMSMedia>;
  createDir(data: { name: string; parentId?: string }): Promise<BCMSMedia>;
  deleteById(id: string): Promise<void>;
  count(): Promise<number>;
}
