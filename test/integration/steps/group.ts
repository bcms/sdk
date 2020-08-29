import { Group, PropType } from '../../../src/interfaces';
import { ObjectUtilPrototype } from '../../util';

export function GroupSteps(sdk, hash, ou: ObjectUtilPrototype) {
  return {
    async create1st(grp1: Group) {
      grp1 = await sdk.group.add({
        label: `Sociall ${hash}`,
        desc: 'This is some description.',
      });
      ou.eq(
        grp1,
        {
          label: `Sociall ${hash}`,
          name: `sociall_${hash}`,
          desc: 'This is some description.',
          props: [],
        },
        grp1.name,
      );
      return grp1;
    },
    async create2nd(grp2: Group) {
      grp2 = await sdk.group.add({
        label: `Person ${hash}`,
        desc: 'This is some description.',
      });
      ou.eq(
        grp2,
        {
          label: `Person ${hash}`,
          name: `person_${hash}`,
          desc: 'This is some description.',
          props: [],
        },
        'group2',
      );
      return grp2;
    },
    async update2ndAndLinkTo1st(grp1: Group, grp2: Group) {
      grp2 = await sdk.group.update({
        _id: grp2._id,
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
                _id: grp1._id,
              },
            },
          },
        ],
      });
      ou.eq(
        grp2,
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
                _id: grp1._id,
                items: [
                  {
                    props: grp1.props,
                  },
                ],
              },
            },
          ],
        },
        grp2.name,
      );
      return { grp1, grp2 };
    },
    async addPropsTo1stAndCheck2nd(grp1: Group, grp2: Group) {
      grp1 = await sdk.group.update({
        _id: grp1._id,
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
        grp1,
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
      grp2 = await sdk.group.get(grp2._id);
      ou.eq(
        grp2,
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
                _id: grp1._id,
                items: [
                  {
                    props: grp1.props,
                  },
                ],
              },
            },
          ],
        },
        'group2',
      );
      return { grp1, grp2 };
    },
    async upAndRemPropsIn1stAndCheck2nd(grp1: Group, grp2: Group) {
      grp1 = await sdk.group.update({
        _id: grp1._id,
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
        grp1,
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
      grp2 = await sdk.group.get(grp2._id);
      ou.eq(
        grp2,
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
                _id: grp1._id,
                items: [
                  {
                    props: grp1.props,
                  },
                ],
              },
            },
          ],
        },
        'group2',
      );
      return { grp1, grp2 };
    },
    async delete1stAndCheck2nd(grp1: Group, grp2: Group) {
      await sdk.group.deleteById(grp1._id);
      grp2 = await sdk.group.get(grp2._id);
      ou.eq(
        grp2,
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
    },
    async delete2nd(grp2: Group) {
      await sdk.group.deleteById(grp2._id);
      try {
        await sdk.group.get(grp2._id);
      } catch (error) {
        return;
      }
      throw Error('Expected to fail when trying to get deleted group.');
    },
  };
}
