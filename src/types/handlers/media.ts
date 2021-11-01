import type { BCMSSdkCache } from '../cache';
import type { SendFunction } from '../main';
import type { BCMSMedia } from '../models';
import type { BCMSStringUtility } from '../util';

export interface BCMSMediaHandlerConfig {
  send: SendFunction;
  cache: BCMSSdkCache;
  stringUtil: BCMSStringUtility;
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
  duplicateFile(data: { _id: string; duplicateTo: string }): Promise<BCMSMedia>;
  moveFile(data: { _id: string; moveTo: string }): Promise<BCMSMedia>;
}
