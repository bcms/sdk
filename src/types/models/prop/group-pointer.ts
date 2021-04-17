import type { BCMSProp } from './prop';

export interface BCMSPropGroupPointer {
  _id: string;
  items: Array<{
    props: BCMSProp[];
  }>;
}
