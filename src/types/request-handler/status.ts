import type { BCMSSdkDefaultRequestHandlerPrototype } from './default';
import type { BCMSStatus } from '../models';

export interface BCMSSdkStatusRequestHandlerAddData {
  label: string;
  color?: string;
}
export interface BCMSSdkStatusRequestHandlerUpdateData {
  _id: string;
  label?: string;
  color?: string;
}
export type BCMSSdkStatusRequestHandlerPrototype = BCMSSdkDefaultRequestHandlerPrototype<
  BCMSStatus,
  BCMSSdkStatusRequestHandlerAddData,
  BCMSSdkStatusRequestHandlerUpdateData
>;
