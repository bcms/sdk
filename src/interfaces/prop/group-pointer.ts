import { Prop, PropSchema } from './prop';

export interface PropGroupPointer {
  _id: string;
  items: Array<{
    props: Prop[];
  }>;
}

export const PropGroupPointerSchema = {
  _id: {
    __type: 'string',
    __required: true,
  },
  items: {
    __type: 'array',
    __required: true,
    __child: {
      __type: 'object',
      __content: {
        props: {
          __type: 'array',
          __required: true,
          __child: {
            __type: 'object',
            __content: PropSchema,
          },
        },
      },
    },
  },
};
