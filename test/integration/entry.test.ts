import * as crypto from 'crypto';
import { sdk, Login, ObjectUtil } from '../util';
import { Template, Entry, PropType, Group } from '../../src/interfaces';

const hash = crypto.createHash('sha1').update(`${Date.now()}`).digest('hex');
const ou = ObjectUtil();
let template: Template;
let group: Group;
let entry: Entry;

describe('Entry functions', async () => {
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
        ],
      },
      'group',
    );
  });
  it('should create a template for which entry will be created', async () => {
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
    template = await sdk.template.update({
      _id: template._id,
      label: `Test Template 1a ${hash}`,
      propChanges: [
        {
          add: {
            label: 'Draft',
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
  it('should create an entry', async () => {
    const meta = [
      {
        lng: 'en',
        props: [
          {
            label: 'Title',
            name: 'title',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['First Entry'],
          },
          {
            label: 'Slug',
            name: 'slug',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['first-entry'],
          },
          {
            label: 'Draft',
            name: 'draft',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
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
                  props: [
                    {
                      label: 'Github',
                      name: 'github',
                      array: false,
                      required: true,
                      type: PropType.STRING,
                      value: ['https://github.com/test'],
                    },
                    {
                      label: 'Stack Overflow',
                      name: 'stack_overflow',
                      array: false,
                      required: true,
                      type: PropType.STRING,
                      value: ['https://stackoverflow.com/test'],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        lng: 'sr',
        props: [
          {
            label: 'Title',
            name: 'title',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [''],
          },
          {
            label: 'Slug',
            name: 'slug',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [''],
          },
          {
            label: 'Draft',
            name: 'draft',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
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
              ],
            },
          },
        ],
      },
    ];
    entry = await sdk.entry.add({
      templateId: template._id,
      meta,
    });
    ou.eq(
      entry,
      {
        templateId: template._id,
        meta,
      },
      'entry',
    );
  });
  it('should update the group and check if entry is updated', async () => {
    group = await sdk.group.update({
      _id: group._id,
      label: `Social ${hash}`,
      propChanges: [
        {
          add: {
            label: 'Facebook',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['https://facebook.com'],
          },
        },
        {
          update: {
            label: {
              old: 'Github',
              new: 'New Github',
            },
            required: true,
          },
        },
        {
          remove: 'stack_overflow',
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
    entry = await sdk.entry.get(entry._id);
    const meta = [
      {
        lng: 'en',
        props: [
          {
            label: 'Title',
            name: 'title',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['First Entry'],
          },
          {
            label: 'Slug',
            name: 'slug',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['first-entry'],
          },
          {
            label: 'Draft',
            name: 'draft',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
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
                  props: [
                    {
                      label: 'New Github',
                      name: 'new_github',
                      array: false,
                      required: true,
                      type: PropType.STRING,
                      value: ['https://github.com/test'],
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
              ],
            },
          },
        ],
      },
      {
        lng: 'sr',
        props: [
          {
            label: 'Title',
            name: 'title',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [''],
          },
          {
            label: 'Slug',
            name: 'slug',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [''],
          },
          {
            label: 'Draft',
            name: 'draft',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
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
                  props: [
                    {
                      label: 'New Github',
                      name: 'new_github',
                      array: false,
                      required: true,
                      type: PropType.STRING,
                      value: ['https://github.com'],
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
              ],
            },
          },
        ],
      },
    ];
    ou.eq(
      entry,
      {
        templateId: template._id,
        meta,
      },
      'entry',
    );
  });
  it('should update the template and check if entry is updated', async () => {
    template = await sdk.template.update({
      _id: template._id,
      propChanges: [
        {
          add: {
            label: 'Admin',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
          },
        },
      ],
    });
    entry = await sdk.entry.get(entry._id);
    const meta = [
      {
        lng: 'en',
        props: [
          {
            label: 'Title',
            name: 'title',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['First Entry'],
          },
          {
            label: 'Slug',
            name: 'slug',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['first-entry'],
          },
          {
            label: 'Draft',
            name: 'draft',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
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
                  props: [
                    {
                      label: 'New Github',
                      name: 'new_github',
                      array: false,
                      required: true,
                      type: PropType.STRING,
                      value: ['https://github.com/test'],
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
              ],
            },
          },
          {
            label: 'Admin',
            name: 'admin',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
          },
        ],
      },
      {
        lng: 'sr',
        props: [
          {
            label: 'Title',
            name: 'title',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [''],
          },
          {
            label: 'Slug',
            name: 'slug',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [''],
          },
          {
            label: 'Draft',
            name: 'draft',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
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
                  props: [
                    {
                      label: 'New Github',
                      name: 'new_github',
                      array: false,
                      required: true,
                      type: PropType.STRING,
                      value: ['https://github.com'],
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
              ],
            },
          },
          {
            label: 'Admin',
            name: 'admin',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
          },
        ],
      },
    ];
    ou.eq(
      entry,
      {
        templateId: template._id,
        meta,
      },
      'entry',
    );
  });
  it('should delete the group and check if entry is updated', async () => {
    await sdk.group.deleteById(group._id);
    template = await sdk.template.get(template._id);
    entry = await sdk.entry.get(entry._id);
    const meta = [
      {
        lng: 'en',
        props: [
          {
            label: 'Title',
            name: 'title',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['First Entry'],
          },
          {
            label: 'Slug',
            name: 'slug',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['first-entry'],
          },
          {
            label: 'Draft',
            name: 'draft',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
          },
          {
            label: 'Admin',
            name: 'admin',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
          },
        ],
      },
      {
        lng: 'sr',
        props: [
          {
            label: 'Title',
            name: 'title',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [''],
          },
          {
            label: 'Slug',
            name: 'slug',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [''],
          },
          {
            label: 'Draft',
            name: 'draft',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
          },
          {
            label: 'Admin',
            name: 'admin',
            array: false,
            required: true,
            type: PropType.BOOLEAN,
            value: [false],
          },
        ],
      },
    ];
    ou.eq(
      entry,
      {
        templateId: template._id,
        meta,
      },
      'entry',
    );
  });
  it('should delete the template and check if entry is also deleted', async () => {
    await sdk.template.deleteById(template._id);
    try {
      entry = await sdk.entry.get(entry._id);
    } catch (error) {
      return;
    }
    throw Error(
      `Expected to fail when getting the entry after template was deleted.`,
    );
  });
});
