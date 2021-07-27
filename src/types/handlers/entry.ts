import type { SendFunction } from '../main';
import type {
  BCMSEntry,
  BCMSEntryCreateData,
  BCMSEntryLite,
  BCMSEntryUpdateData,
} from '../models';
import type { BCMSStore } from '../store';

export interface BCMSEntryHandlerConfig {
  send: SendFunction;
  store: BCMSStore;
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
