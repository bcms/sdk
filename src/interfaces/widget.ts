import { Prop } from './prop';

export interface Widget {
  _id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  label: string;
  desc: string;
  previewImage: string;
  previewScript: string;
  previewStyle: string;
  props: Prop[];
}
