export interface PropQuillOption {
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

export interface PropQuill {
  text: string;
  ops: PropQuillOption[];
}
