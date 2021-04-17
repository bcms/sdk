import type { BCMSProp } from './prop';

export interface BCMSEntryMeta {
  lng: string;
  props: BCMSProp[];
}
export interface BCMSEntryContent {
  lng: string;
  props: BCMSProp[];
}

export interface BCMSEntryLite {
  _id: string;
  createdAt: number;
  updatedAt: number;
  templateId: string;
  userId: string;
  meta: BCMSEntryMeta[];
  status?: string;
}

export interface BCMSEntry {
  _id: string;
  createdAt: number;
  updatedAt: number;
  templateId: string;
  userId: string;
  meta: BCMSEntryMeta[];
  content?: BCMSEntryContent[];
  status?: string;
}
