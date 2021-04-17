import type { BCMSSdkDefaultRequestHandlerPrototype } from './default';
import type { BCMSLanguage } from '../models';

export interface BCMSSdkLanguageRequestHandlerAddData {
  code: string;
  name: string;
  nativeName: string;
}
export interface BCMSSdkLanguageRequestHandlerUpdateData {
  _id: string;
  def?: boolean;
}
export type BCMSSdkLanguageRequestHandlerPrototype = BCMSSdkDefaultRequestHandlerPrototype<
  BCMSLanguage,
  BCMSSdkLanguageRequestHandlerAddData,
  BCMSSdkLanguageRequestHandlerUpdateData
>;
