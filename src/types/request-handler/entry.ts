import type {
  BCMSEntry,
  BCMSEntryContent,
  BCMSEntryLite,
  BCMSEntryMeta,
} from '../models';

export interface BCMSSdkEntryRequestHandlerPrototype {
  getAllLite(templateId: string): Promise<BCMSEntryLite[]>;
  getManyLite(templateId: string, ids: string[]): Promise<BCMSEntryLite[]>;
  getLite(templateId: string, id: string): Promise<BCMSEntryLite>;
  get(templateId: string, id: string): Promise<BCMSEntry>;
  create(data: {
    templateId: string;
    status?: string;
    meta: BCMSEntryMeta[];
    content: BCMSEntryContent[];
  }): Promise<BCMSEntry>;
  update(data: {
    _id: string;
    templateId: string;
    status?: string;
    meta: BCMSEntryMeta[];
    content: BCMSEntryContent[];
  }): Promise<BCMSEntry>;
  deleteById(templateId: string, id: string): Promise<void>;
  count(templateId: string): Promise<number>;
}
