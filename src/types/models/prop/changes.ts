import type { BCMSPropData, BCMSPropType } from './main';

export interface BCMSPropChange {
  add?: {
    label: string;
    type: BCMSPropType;
    required: boolean;
    array: boolean;
    defaultData?: BCMSPropData;
  };
  /** ID of the property which will be removed. */
  remove?: string;
  update?: {
    /** ID of the property which should be updated. */
    id: string;
    label: string;
    move: number;
    required: boolean;
    enumItems?: string[];
  };
}
