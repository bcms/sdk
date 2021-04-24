import type { BCMSSdkDefaultRequestHandlerPrototype } from './default';
import type { BCMSPropChange, BCMSTemplate } from '../models';

export interface BCMSSdkTemplateRequestHandlerAddData {
  label: string;
  desc: string;
  singleEntry: boolean;
}
export interface BCMSSdkTemplateRequestHandlerUpdateData {
  _id: string;
  label?: string;
  desc?: string;
  propChanges?: BCMSPropChange[];
}
export type BCMSSdkTemplateRequestHandlerPrototype = BCMSSdkDefaultRequestHandlerPrototype<
  BCMSTemplate,
  BCMSSdkTemplateRequestHandlerAddData,
  BCMSSdkTemplateRequestHandlerUpdateData
>;
