import { PropEnum } from './enum';
import { PropGroupPointer, PropGroupPointerArray } from './group-pointer';
import { PropEntryPointer, PropEntryPointerArray } from './entry-pointer';

export enum PropType {
  GROUP_POINTER = 'GROUP_POINTER',
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  ENUMERATION = 'ENUMERATION',
  BOOLEAN = 'BOOLEAN',
  MEDIA = 'MEDIA',

  ENTRY_POINTER = 'ENTRY_POINTER',

  GROUP_POINTER_ARRAY = 'GROUP_POINTER_ARRAY',
  STRING_ARRAY = 'STRING_ARRAY',
  NUMBER_ARRAY = 'NUMBER_ARRAY',
  BOOLEAN_ARRAY = 'BOOLEAN_ARRAY',
  ENTRY_POINTER_ARRAY = 'ENTRY_POINTER_ARRAY',
}

export interface Prop {
  type: PropType;
  required: boolean;
  name: string;
  value:
    | string
    | string[]
    | boolean
    | boolean[]
    | number
    | number[]
    | PropEnum
    | PropGroupPointer
    | PropGroupPointerArray
    | PropEntryPointer
    | PropEntryPointerArray;
}
