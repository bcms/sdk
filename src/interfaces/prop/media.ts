export interface PropMedia {
  id: string;
  altText: string;
}

export const PropMediaSchema = {
  id: {
    __type: 'string',
    __required: true,
  },
  altText: {
    __type: 'string',
    __required: true,
  },
};
