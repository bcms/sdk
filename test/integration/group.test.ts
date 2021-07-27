import * as crypto from 'crypto';
import { sdk, Login, ObjectUtil } from '../util';
import { Group, PropType } from '../../src/interfaces';

const hash = crypto.createHash('sha1').update(`${Date.now()}`).digest('hex');
const ou = ObjectUtil();
let group1: Group;
let group2: Group;

describe('Group functions', async () => {
  Login();
  it('should create a 1st group that will be used in 2nd group', async () => {
    group1 = await sdk.group.add({
      label: `Sociall ${hash}`,
      desc: 'This is some description.',
    });
    ou.eq(
      group1,
      {
        label: `Sociall ${hash}`,
        name: `sociall_${hash}`,
        desc: 'This is some description.',
        props: [],
      },
      'group1',
    );
  });
  it('should create a 2nd', async () => {
    group2 = await sdk.group.add({
      label: `Person ${hash}`,
      desc: 'This is some description.',
    });
    ou.eq(
      group2,
      {
        label: `Person ${hash}`,
        name: `person_${hash}`,
        desc: 'This is some description.',
        props: [],
      },
      'group2',
    );
  });
  it('should update props in 2nd group and link 1st group to it', async () => {
    group2 = await sdk.group.update({
      _id: group2._id,
      propChanges: [
        {
          add: {
            label: 'Full Name',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['Test 1'],
          },
        },
        {
          add: {
            label: 'Social Media',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group1._id,
            },
          },
        },
      ],
    });
    ou.eq(
      group2,
      {
        label: `Person ${hash}`,
        name: `person_${hash}`,
        desc: 'This is some description.',
        props: [
          {
            label: 'Full Name',
            name: 'full_name',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['Test 1'],
          },
          {
            label: 'Social Media',
            name: 'social_media',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group1._id,
              items: [
                {
                  props: group1.props,
                },
              ],
            },
          },
        ],
      },
      'group2',
    );
  });
  it('should add props to 1st group and check it 2nd group is updated', async () => {
    group1 = await sdk.group.update({
      _id: group1._id,
      label: `Social ${hash}`,
      propChanges: [
        {
          add: {
            label: 'Github',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['https://github.com'],
          },
        },
        {
          add: {
            label: 'Stack Overfloww',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['https://stackoverflow.com'],
          },
        },
        {
          add: {
            label: 'Facebook',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['https://facebook.com'],
          },
        },
      ],
    });
    ou.eq(
      group1,
      {
        label: `Social ${hash}`,
        name: `social_${hash}`,
        desc: 'This is some description.',
        props: [
          {
            label: 'Github',
            name: 'github',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['https://github.com'],
          },
          {
            label: 'Stack Overfloww',
            name: 'stack_overfloww',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['https://stackoverflow.com'],
          },
          {
            label: 'Facebook',
            name: 'facebook',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['https://facebook.com'],
          },
        ],
      },
      'group1',
    );
    group2 = await sdk.group.get(group2._id);
    ou.eq(
      group2,
      {
        label: `Person ${hash}`,
        name: `person_${hash}`,
        desc: 'This is some description.',
        props: [
          {
            label: 'Full Name',
            name: 'full_name',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['Test 1'],
          },
          {
            label: 'Social Media',
            name: 'social_media',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group1._id,
              items: [
                {
                  props: group1.props,
                },
              ],
            },
          },
        ],
      },
      'group2',
    );
  });
  it('should update and remove props in 1st group and check it 2nd group is updated', async () => {
    group1 = await sdk.group.update({
      _id: group1._id,
      label: `Social ${hash}`,
      propChanges: [
        {
          update: {
            label: {
              old: 'Stack Overfloww',
              new: 'Stack Overflow',
            },
            required: true,
          },
        },
        {
          remove: 'facebook',
        },
      ],
    });
    ou.eq(
      group1,
      {
        label: `Social ${hash}`,
        name: `social_${hash}`,
        desc: 'This is some description.',
        props: [
          {
            label: 'Github',
            name: 'github',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['https://github.com'],
          },
          {
            label: 'Stack Overflow',
            name: 'stack_overflow',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['https://stackoverflow.com'],
          },
        ],
      },
      'group1',
    );
    group2 = await sdk.group.get(group2._id);
    ou.eq(
      group2,
      {
        label: `Person ${hash}`,
        name: `person_${hash}`,
        desc: 'This is some description.',
        props: [
          {
            label: 'Full Name',
            name: 'full_name',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['Test 1'],
          },
          {
            label: 'Social Media',
            name: 'social_media',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group1._id,
              items: [
                {
                  props: group1.props,
                },
              ],
            },
          },
        ],
      },
      'group2',
    );
  });
  it('should fail when adding new prop to 1st group with name that exist', async () => {
    try {
      group1 = await sdk.group.update({
        _id: group1._id,
        label: `Social ${hash}`,
        propChanges: [
          {
            add: {
              label: 'Github',
              array: false,
              required: true,
              type: PropType.STRING,
              value: ['https://github.com'],
            },
          },
        ],
      });
    } catch (error) {
      return;
    }
    throw new Error(
      'Expected to fail when trying to add property with name that already exist.',
    );
  });
  it('should fail when updating existing prop in 1st group with name that exist', async () => {
    try {
      group1 = await sdk.group.update({
        _id: group1._id,
        label: `Social ${hash}`,
        propChanges: [
          {
            update: {
              label: {
                old: 'Stack Overflow',
                new: 'Github',
              },
              required: true,
            },
          },
        ],
      });
    } catch (error) {
      return;
    }
    throw new Error(
      'Expected to fail when trying to update prop with name that already exist.',
    );
  });
  it('should delete 1st group and check if 2nd group is updated', async () => {
    await sdk.group.deleteById(group1._id);
    group2 = await sdk.group.get(group2._id);
    ou.eq(
      group2,
      {
        label: `Person ${hash}`,
        name: `person_${hash}`,
        desc: 'This is some description.',
        props: [
          {
            label: 'Full Name',
            name: 'full_name',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['Test 1'],
          },
        ],
      },
      'group2',
    );
  });
  it('should delete 2nd group', async () => {
    await sdk.group.deleteById(group2._id);
    try {
      await sdk.group.get(group2._id);
    } catch (error) {
      return;
    }
    throw Error('Expected to fail when trying to get deleted group.');
  });
});
