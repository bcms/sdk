import type { BCMSPropParsed } from './main';

export interface BCMSPropEntryPointerData {
  templateId: string;
  entryIds: string[];
  displayProp: string;
}

export interface BCMSPropEntryPointerDataParsed {
  [lng: string]: BCMSPropParsed;
}
