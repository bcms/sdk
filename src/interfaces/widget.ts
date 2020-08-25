import { Prop } from './prop';

export interface Widget {
  _id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  desc: string;
  props: Prop[];
  _schema: any;
}
