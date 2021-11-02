import type { BCMSSdkCache } from '../cache';
import type { SendFunction } from '../main';
import type {
  BCMSEntry,
  BCMSEntryCreateData,
  BCMSEntryLite,
  BCMSEntryUpdateData,
} from '../models';

export interface BCMSEntryHandlerConfig {
  send: SendFunction;
  cache: BCMSSdkCache;
}

export interface BCMSEntryHandler {
  getAllLite(data: { templateId: string }): Promise<BCMSEntryLite[]>;
  getManyLite(data: {
    templateId: string;
    entryIds: string[];
    skipCache?: boolean;
  }): Promise<BCMSEntryLite[]>;
  getLite(data: {
    templateId: string;
    entryId: string;
    skipCache?: boolean;
  }): Promise<BCMSEntryLite>;
  get(data: {
    templateId: string;
    entryId: string;
    skipCache?: boolean;
  }): Promise<BCMSEntry>;
  create(data: BCMSEntryCreateData): Promise<BCMSEntry>;
  update(data: BCMSEntryUpdateData): Promise<BCMSEntry>;
  deleteById(data: { templateId: string; entryId: string }): Promise<void>;
  count(data: { templateId: string }): Promise<number>;
}
