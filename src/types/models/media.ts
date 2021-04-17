// eslint-disable-next-line no-shadow
export enum BCMSMediaType {
  DIR = 'DIR',
  IMG = 'IMG',
  VID = 'VID',
  TXT = 'TXT',
  GIF = 'GIF',
  OTH = 'OTH',
  PDF = 'PDF',
  CODE = 'CODE',
  JS = 'JS',
  HTML = 'HTML',
  CSS = 'CSS',
  JAVA = 'JAVA',
  PHP = 'PHP',
  FONT = 'FONT',
}

export interface BCMSMedia {
  _id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  type: BCMSMediaType;
  mimetype: string;
  size: number;
  name: string;
  path: string;
  isInRoot: boolean;
  hasChildren: boolean;
  parentId: string;
}

export interface BCMSMediaAggregate {
  _id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  type: BCMSMediaType;
  mimetype: string;
  size: number;
  name: string;
  path: string;
  isInRoot: boolean;
  children?: BCMSMediaAggregate[];
  state: boolean;
}
