import type { BCMSProp } from './prop';

export interface BCMSTemplate {
  _id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  label: string;
  desc: string;
  userId: string;
  singleEntry: boolean;
  props: BCMSProp[];
}
