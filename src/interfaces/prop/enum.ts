export interface PropEnum {
  items: string[];
  selected?: string;
}

export const PropEnumSchema = {
  items: {
    __type: 'array',
    __required: true,
    __child: {
      __type: 'string',
    },
  },
  selected: {
    __type: 'string',
    __required: true,
  },
};
