import type { BCMSSdkDefaultRequestHandlerPrototype } from './default';
import type {
  BCMSGroup,
  BCMSPropChange,
  BCMSTemplate,
  BCMSWidget,
} from '../models';

export interface BCMSSdkGroupRequestHandlerAddData {
  label: string;
  desc: string;
}
export interface BCMSSdkGroupRequestHandlerUpdateData {
  _id: string;
  label?: string;
  desc?: string;
  propChanges?: BCMSPropChange[];
}
export interface BCMSSdkGroupRequestHandlerPrototype
  extends BCMSSdkDefaultRequestHandlerPrototype<
    BCMSGroup,
    BCMSSdkGroupRequestHandlerAddData,
    BCMSSdkGroupRequestHandlerUpdateData
  > {
  whereIsItUsed(
    id: string,
  ): Promise<{
    templates: BCMSTemplate[];
    groups: BCMSGroup[];
    widgets: BCMSWidget[];
  }>;
}
