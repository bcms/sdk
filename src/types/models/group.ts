import type { BCMSProp } from './prop';

export interface BCMSGroup {
  _id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  label: string;
  desc: string;
  props: BCMSProp[];
}
