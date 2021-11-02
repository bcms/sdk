import type { BCMSEntity } from './entity';

export type BCMSColorSourceType = 'group' | 'widget' | 'template';

export interface BCMSColorSource {
  id: string;
  type: BCMSColorSourceType;
}

export interface BCMSColor extends BCMSEntity {
  cid: string;
  label: string;
  name: string;
  value: string;
  userId: string;
  source: BCMSColorSource;
}

export interface BCMSColorCreateData {
  label: string;
  value: string;
  source: {
    id: string;
    type: BCMSColorSourceType;
  };
}

export interface BCMSColorUpdateData {
  _id: string;
  label?: string;
  value?: string;
}
