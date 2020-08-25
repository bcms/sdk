import { Prop } from './prop';

export interface Group {
  _id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  desc: string;
  props: Prop[];
  _schema: any;
}
