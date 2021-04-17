import type { BCMSSdkDefaultRequestHandlerPrototype } from './default';
import type { BCMSPropChange, BCMSWidget } from '../models';

export interface BCMSSdkWidgetRequestHandlerAddData {
  label: string;
  desc: string;
  singleEntry: boolean;
  previewImage: string;
  previewScript: string;
  previewStyle: string;
}
export interface BCMSSdkWidgetRequestHandlerUpdateData {
  _id: string;
  label?: string;
  desc?: string;
  previewImage?: string;
  previewScript?: string;
  previewStyle?: string;
  propChanges?: BCMSPropChange[];
}
export type BCMSSdkWidgetRequestHandlerPrototype = BCMSSdkDefaultRequestHandlerPrototype<
  BCMSWidget,
  BCMSSdkWidgetRequestHandlerAddData,
  BCMSSdkWidgetRequestHandlerUpdateData
>;
