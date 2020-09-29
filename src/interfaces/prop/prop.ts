import { PropEnum } from './enum';
import { PropGroupPointer } from './group-pointer';
import { PropEntryPointer } from './entry-pointer';
import { PropMedia } from './media';
import { PropQuill } from './quill';
import { PropWidget } from './widget';

export enum PropType {
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
}

export interface Prop {
  type: PropType;
  required: boolean;
  name: string;
  label: string;
  array: boolean;
  value:
    | string[]
    | boolean[]
    | number[]
    | PropEnum
    | PropGroupPointer
    | PropEntryPointer
    | PropMedia[]
    | PropQuill
    | PropWidget;
}