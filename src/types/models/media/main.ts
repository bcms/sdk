import type { BCMSEntity } from '..';

// eslint-disable-next-line no-shadow
export enum BCMSMediaType {
  DIR = 'DIR',
  IMG = 'IMG',
  VID = 'VID',
  TXT = 'TXT',
  GIF = 'GIF',
  OTH = 'OTH',
  PDF = 'PDF',
  JS = 'JS',
  HTML = 'HTML',
  CSS = 'CSS',
  JAVA = 'JAVA',
}

export interface BCMSMedia extends BCMSEntity {
  userId: string;
  type: BCMSMediaType;
  mimetype: string;
  size: number;
  name: string;
  isInRoot: boolean;
  hasChildren: boolean;
  parentId: string;
}

export interface BCMSMediaAddDirData {
  name: string;
  parentId?: string;
}

export interface BCMSMediaUpdateData {
  _id: string;
  rename?: string;
  /** ID of the parent dir or `root`. */
  moveTo?: string;
}
