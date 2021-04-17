import type { BCMSPropType } from './prop';

export interface BCMSPropChange {
  add?: {
    label: string;
    type: BCMSPropType;
    required: boolean;
    array: boolean;
    value?: any;
  };
  remove?: string;
  update?: {
    label: {
      old: string;
      new: string;
    };
    move: number;
    required: boolean;
    enumItems?: string[];
  };
}
