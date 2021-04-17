import type { BCMSProp } from './prop';

export interface BCMSWidget {
  _id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  label: string;
  desc: string;
  previewImage: string;
  previewScript: string;
  previewStyle: string;
  props: BCMSProp[];
}
