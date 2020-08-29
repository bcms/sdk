import * as crypto from 'crypto';
import { expect, assert } from 'chai';
import { sdk, Login, ObjectUtil, General } from '../util';
import { PropType, Template, Group } from '../../src/interfaces';
import { GroupSteps } from './group.test';

const hash = crypto
  .createHash('sha1')
  .update('' + Date.now())
  .digest('hex');
const ou = ObjectUtil();
const general = General();
let template1: Template;
let group1: Group;
let group2: Group;

describe('Template functions', async () => {
  Login();
  it('should create a 1st group that will be used by template', async () => {
    group1 = await GroupSteps.create1st(group1);
  });
  it('should create a 2nd group that will be used in a 1st group', async () => {
    group2 = await GroupSteps.create2nd(group2);
  });
  it('should create a new template', async () => {
    template1 = await TemplateSteps.create();
  });
  it('should add props to template and link 2nd group', async () => {
    template1 = await TemplateSteps.addPropsAndLinkGroup(template1, group2);
  });
  it('should add props to 1st group and check if template is updated', async () => {
    const result = await TemplateSteps.updateGroupAndCheckTemplate(
      template1,
      group1,
      group2,
    );
    template1 = result.template;
    group1 = result.grp1;
    group2 = result.grp2;
  });
  it('should update');
});

export const TemplateSteps = {
  async create() {
    const template = await sdk.template.add({
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
    return template;
  },
  async addPropsAndLinkGroup(template: Template, group: Group) {
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
            label: 'Person',
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
    ou.eq(template, {
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
          label: 'Person',
          name: 'person',
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
    });
    return template;
  },
  async updateGroupAndCheckTemplate(
    template: Template,
    grp1: Group,
    grp2: Group,
  ) {
    const groupResult = await GroupSteps.addPropsTo1stAndCheck2nd(grp1, grp2);
    template = await sdk.template.get(template._id);
    ou.eq(template, {
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
          label: 'Person',
          name: 'person',
          array: false,
          required: true,
          type: PropType.GROUP_POINTER,
          value: {
            _id: groupResult.grp2._id,
            items: [
              {
                props: groupResult.grp2.props,
              },
            ],
          },
        },
      ],
    });
    return {
      template,
      ...groupResult,
    };
  },
};
