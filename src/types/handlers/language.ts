import type { SendFunction } from '../main';
import type { BCMSLanguage } from '../models';
import type { BCMSStore } from '../store';
import type { BCMSDefaultHandler } from './_defaults';

export interface BCMSLanguageAddData {
  code: string;
  name: string;
  nativeName: string;
}

export interface BCMSLanguageUpdateData {
  _id: string;
  def?: boolean;
}

export interface BCMSLanguageHandlerConfig {
  send: SendFunction;
  store: BCMSStore;
}

export type BCMSLanguageHandler = BCMSDefaultHandler<
  BCMSLanguage,
  BCMSLanguageAddData,
  BCMSLanguageUpdateData
>;
