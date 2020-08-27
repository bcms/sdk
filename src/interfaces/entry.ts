import { Prop } from './prop';

export interface EntryMeta {
  lng: string;
  props: Prop[];
}

export interface EntryLite {
  _id: string;
  createdAt: number;
  updatedAt: number;
  title: string;
  slug: string;
  templateId: string;
  userId: string;
  meta: EntryMeta[];
}

export interface Entry {
  _id: string;
  createdAt: number;
  updatedAt: number;
  title: string;
  slug: string;
  templateId: string;
  userId: string;
  meta: EntryMeta[];
  content?: any[];
}
