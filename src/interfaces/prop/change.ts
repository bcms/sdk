import { Prop } from './prop';

export interface PropChange {
  add?: Prop;
  remove?: string;
  update?: {
    name: {
      old: string;
      new: string;
    };
    required: boolean;
  };
}
