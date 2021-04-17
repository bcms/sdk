export interface BCMSPropQuillOption {
  insert: string;
  attributes?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    list?: string;
    indent?: number;
    link?: string;
  };
}

export interface BCMSPropQuill {
  text: string;
  ops: BCMSPropQuillOption[];
}
