import * as crypto from 'crypto';
import { sdk, Login, ObjectUtil, General } from '../util';
import { PropType, Template, Group } from '../../src/interfaces';

const hash = crypto
  .createHash('sha1')
  .update('' + Date.now())
  .digest('hex');
const ou = ObjectUtil();
let template: Template;
let group: Group;

describe('Template functions', async () => {
  Login();
  it('should create a group that will be used in the template', async () => {
    group = await sdk.group.add({
      label: `Social ${hash}`,
      desc: 'This is some description.',
    });
    group = await sdk.group.update({
      _id: group._id,
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
            label: 'Stack Overflow',
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
      group,
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
      'group',
    );
  });
  it('should create the template', async () => {
    template = await sdk.template.add({
      label: `Blog ${hash}`,
      desc: 'This is some description.',
      singleEntry: false,
    });
    ou.eq(
      template,
      {
        label: `Blog ${hash}`,
        name: `blog_${hash}`,
        desc: 'This is some description.',
        props: [],
      },
      'template',
    );
  });
  it('should add props to template and link to the group', async () => {
    template = await sdk.template.update({
      _id: template._id,
      label: `Test Template 1a ${hash}`,
      propChanges: [
        {
          add: {
            label: 'Draftt',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [true],
          },
        },
        {
          add: {
            label: 'Admin',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [true],
          },
        },
        {
          add: {
            label: 'Social',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group._id,
            },
          },
        },
      ],
    });
    ou.eq(
      template,
      {
        name: template.name,
        desc: 'This is some description.',
        props: [
          {
            label: 'Draftt',
            name: 'draftt',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [true],
          },
          {
            label: 'Admin',
            name: 'admin',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [true],
          },
          {
            label: 'Social',
            name: 'social',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group._id,
              items: [
                {
                  props: group.props,
                },
              ],
            },
          },
        ],
      },
      'template',
    );
  });
  it('should update the group and check if the template is updated', async () => {
    group = await sdk.group.update({
      _id: group._id,
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
    template = await sdk.template.get(template._id);
    ou.eq(
      template,
      {
        name: template.name,
        desc: 'This is some description.',
        props: [
          {
            label: 'Draftt',
            name: 'draftt',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [true],
          },
          {
            label: 'Admin',
            name: 'admin',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [true],
          },
          {
            label: 'Social',
            name: 'social',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group._id,
              items: [
                {
                  props: group.props,
                },
              ],
            },
          },
        ],
      },
      'template',
    );
  });
  it('should update the template', async () => {
    template = await sdk.template.update({
      _id: template._id,
      propChanges: [
        {
          update: {
            label: {
              old: 'Draftt',
              new: 'Draft',
            },
            required: true,
          },
        },
        {
          remove: 'admin',
        },
      ],
    });
    ou.eq(
      template,
      {
        name: template.name,
        desc: 'This is some description.',
        props: [
          {
            label: 'Draft',
            name: 'draft',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [true],
          },
          {
            label: 'Social',
            name: 'social',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group._id,
              items: [
                {
                  props: group.props,
                },
              ],
            },
          },
        ],
      },
      'template',
    );
  });
  it('should remove the group and check if template is updated', async () => {
    await sdk.group.deleteById(group._id);
    template = await sdk.template.get(template._id);
    ou.eq(
      template,
      {
        name: template.name,
        desc: 'This is some description.',
        props: [
          {
            label: 'Draft',
            name: 'draft',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [true],
          },
        ],
      },
      'template',
    );
  });
  it('should delete the template', async () => {
    await sdk.template.deleteById(template._id);
  });
  it('should fail when trying to get the template', async () => {
    try {
      await sdk.template.get(template._id);
    } catch (error) {
      return;
    }
    throw Error('Expected to fail when trying to get deleted template.');
  });
});
