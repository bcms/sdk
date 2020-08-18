import { Prop } from './prop';

export interface PropGroupPointer {
  _id: string;
  props: Prop[];
}

export interface PropGroupPointerArray {
  _id: string;
  array: Array<{
    uuid: string;
    props: Prop[];
  }>;
}
