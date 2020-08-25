import { Prop } from './prop';

export interface Template {
  _id: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  label: string;
  desc: string;
  userId: string;
  singleEntry: boolean;
  props: Prop[];
  _schema: any;
}
