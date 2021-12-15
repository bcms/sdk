import type { BCMSEntity } from './entity';
export type BCMSChangeName =
  | 'entry'
  | 'group'
  | 'color'
  | 'language'
  | 'media'
  | 'status'
  | 'tag'
  | 'templates'
  | 'widget';

export interface BCMSChange extends BCMSEntity {
  name: BCMSChangeName;
  count: number;
}

interface GetInfoDataProp {
  count: number;
  lastChangeAt: number;
}

export interface GetInfoData {
  entry: GetInfoDataProp;
  group: GetInfoDataProp;
  color: GetInfoDataProp;
  language: GetInfoDataProp;
  media: GetInfoDataProp;
  status: GetInfoDataProp;
  tag: GetInfoDataProp;
  templates: GetInfoDataProp;
  widget: GetInfoDataProp;
}