import type { BCMSEntity } from './entity';

export interface BCMSTag extends BCMSEntity {
  value: string;
}

export interface BCMSTagCreateData {
  value: string;
}

export interface BCMSTagUpdateData {
  _id: string;
  value: string;
}
