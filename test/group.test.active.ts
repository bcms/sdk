import { expect } from 'chai';
import { sdk, Login, ObjectUtil } from './util';
import { Group, PropType } from '../src/interfaces';

const ou = ObjectUtil();
let group1: Group;
let group2: Group;

describe('Group functions', async () => {
  Login();
  it('should create a group-1', async () => {
    const data = await sdk.group.add({
      label: 'Group 1#',
      desc: 'This is some description.',
    });
    ou.eq(
      data,
      {
        name: 'group-1',
        desc: 'This is some description.',
      },
      'data',
    );
    group1 = data;
  });
  it('should create a group-2', async () => {
    const data = await sdk.group.add({
      label: 'Group 2#',
      desc: 'This is some description.',
    });
    ou.eq(
      data,
      {
        name: 'group-2',
        desc: 'This is some description.',
      },
      'data',
    );
    group2 = data;
  });
  it('should update the group-1', async () => {
    const data = await sdk.group.update({
      _id: group1._id,
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
            label: 'group 2',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group2._id,
              items: [],
            },
          },
        },
      ],
    });
  });
  it('should update the group-2', async () => {
    try {
      await sdk.group.update({
        _id: group2._id,
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
              label: 'group 1',
              array: false,
              required: true,
              type: PropType.GROUP_POINTER,
              value: {
                _id: group1._id,
                items: [],
              },
            },
          },
        ],
      });
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log(error.message);
      return;
    }
    throw new Error('Expected this call to throw an error of infinite loop.');
  });
});
