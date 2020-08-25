import { expect } from 'chai';
import { sdk, Login, ObjectUtil } from './util';
import { PropType, Template, Group } from '../src/interfaces';

const ou = ObjectUtil();
let template: Template;
let group: Group;

describe('Template functions', async () => {
  Login();
  it('should create a new group that will be used by template', async () => {
    const data = await sdk.group.add({
      name: 'Group For Template 1',
      desc: 'This is some description.',
    });
    ou.eq(
      data,
      {
        name: 'group-for-template-1',
        desc: 'This is some description.',
      },
      'data',
    );
    group = data;
  });
  it('should update the group that will be used by template', async () => {
    const data = await sdk.group.update({
      _id: group._id,
      propChanges: [
        {
          add: {
            label: 'Test STR',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['test'],
          },
        },
        {
          add: {
            label: 'Test STR_ARR',
            array: true,
            required: true,
            type: PropType.STRING,
            value: ['test1', 'test2', 'test3'],
          },
        },
        {
          add: {
            label: 'Test NUM',
            array: false,
            required: true,
            type: PropType.NUMBER,
            value: [7],
          },
        },
        {
          add: {
            label: 'Test NUM_ARR',
            array: true,
            required: true,
            type: PropType.NUMBER,
            value: [2, 4, 6, 965],
          },
        },
        {
          add: {
            label: 'Test BOOL',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
          },
        },
        {
          add: {
            label: 'Test BOOL_ARR',
            array: true,
            required: true,
            type: PropType.BOOLEAN,
            value: [true, false, false, true],
          },
        },
        {
          add: {
            label: 'Test DATE',
            array: false,
            required: true,
            type: PropType.DATE,
            value: [123456],
          },
        },
        {
          add: {
            label: 'Test MEDIA',
            array: false,
            required: true,
            type: PropType.MEDIA,
            value: [
              {
                id: '/test.jpg',
                altText: 'Nema',
              },
            ],
          },
        },
        {
          add: {
            label: 'Test MEDIA_ARR',
            array: true,
            required: true,
            type: PropType.MEDIA,
            value: [
              {
                id: '/test.jpg',
                altText: 'Nema',
              },
              {
                id: '/test2.jpg',
                altText: 'Imal tanje',
              },
            ],
          },
        },
        {
          add: {
            label: 'Test ENUM',
            array: false,
            required: true,
            type: PropType.ENUMERATION,
            value: {
              items: ['ITEM_1', 'ITEM_2', 'ITEM_3'],
            },
          },
        },
      ],
    });
  });
  it('should create a new template', async () => {
    const data = await sdk.template.add({
      name: 'Test Template 1#',
      desc: 'This is some description.',
      singleEntry: false,
    });
    ou.eq(
      data,
      {
        name: 'test-template-1',
        desc: 'This is some description.',
      },
      'data',
    );
    template = data;
  });
  it('should update the template', async () => {
    const data = await sdk.template.update({
      _id: template._id,
      propChanges: [
        {
          add: {
            label: 'Test STR',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['test'],
          },
        },
        {
          add: {
            label: 'Test STR_ARR',
            array: true,
            required: true,
            type: PropType.STRING,
            value: ['test1', 'test2', 'test3'],
          },
        },
        {
          add: {
            label: 'Test NUM',
            array: false,
            required: true,
            type: PropType.NUMBER,
            value: [7],
          },
        },
        {
          add: {
            label: 'Test NUM_ARR',
            array: true,
            required: true,
            type: PropType.NUMBER,
            value: [2, 4, 6, 965],
          },
        },
        {
          add: {
            label: 'Test BOOL',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
          },
        },
        {
          add: {
            label: 'Test BOOL_ARR',
            array: true,
            required: true,
            type: PropType.BOOLEAN,
            value: [true, false, false, true],
          },
        },
        {
          add: {
            label: 'Test DATE',
            array: false,
            required: true,
            type: PropType.DATE,
            value: [123456],
          },
        },
        {
          add: {
            label: 'Test MEDIA',
            array: false,
            required: true,
            type: PropType.MEDIA,
            value: [
              {
                id: '/test.jpg',
                altText: 'Nema',
              },
            ],
          },
        },
        {
          add: {
            label: 'Test MEDIA_ARR',
            array: true,
            required: true,
            type: PropType.MEDIA,
            value: [
              {
                id: '/test.jpg',
                altText: 'Nema',
              },
              {
                id: '/test2.jpg',
                altText: 'Imal tanje',
              },
            ],
          },
        },
        {
          add: {
            label: 'Test ENUM',
            array: false,
            required: true,
            type: PropType.ENUMERATION,
            value: {
              items: ['ITEM_1', 'ITEM_2', 'ITEM_3'],
            },
          },
        },
        {
          add: {
            label: 'Test GROUP',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group._id,
              items: [],
            },
          },
        },
      ],
    });
  });
  // it('should update property of the template', async () => {
  //   cosnt data = 
  // })
});
