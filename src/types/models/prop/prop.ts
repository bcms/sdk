import type { BCMSPropEnum } from './enum';
import type { BCMSPropGroupPointer } from './group-pointer';
import type { BCMSPropEntryPointer } from './entry-pointer';
import type { BCMSPropMedia } from './media';
import type { BCMSPropQuill } from './quill';
import type { BCMSPropWidget } from './widget';

// eslint-disable-next-line no-shadow
export enum BCMSPropType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',

  DATE = 'DATE',
  ENUMERATION = 'ENUMERATION',
  MEDIA = 'MEDIA',

  GROUP_POINTER = 'GROUP_POINTER',
  ENTRY_POINTER = 'ENTRY_POINTER',

  HEADING_1 = 'HEADING_1',
  HEADING_2 = 'HEADING_2',
  HEADING_3 = 'HEADING_3',
  HEADING_4 = 'HEADING_4',
  HEADING_5 = 'HEADING_5',

  PARAGRAPH = 'PARAGRAPH',

  LIST = 'LIST',
  EMBED = 'EMBED',
  CODE = 'CODE',
  WIDGET = 'WIDGET',

  RICH_TEXT = 'RICH_TEXT',
}

export interface BCMSProp {
  type: BCMSPropType;
  required: boolean;
  name: string;
  label: string;
  array: boolean;
  value:
    | string[]
    | boolean[]
    | number[]
    | BCMSPropEnum
    | BCMSPropGroupPointer
    | BCMSPropEntryPointer
    | BCMSPropMedia[]
    | BCMSPropQuill
    | BCMSPropWidget;
}
