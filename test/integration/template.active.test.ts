import * as crypto from 'crypto';
import { expect } from 'chai';
import { sdk, Login, ObjectUtil, General } from '../util';
import { PropType, Template, Group } from '../../src/interfaces';

const hash = crypto
  .createHash('sha1')
  .update('' + Date.now())
  .digest('hex');
const ou = ObjectUtil();
const general = General();
let template: Template;
let group: Group;
let group2: Group;

describe('Template functions', async () => {
  Login();
  it('should create a 1st group that will be used by template', async () => {
    await general.delay(1000);
    console.log('\n\n\n');
    group = await sdk.group.add({
      label: `Group For Template 1 ${hash}`,
      desc: 'This is some description.',
    });
    ou.eq(
      group,
      {
        name: `group_for_template_1_${hash}`,
        desc: 'This is some description.',
      },
      'data',
    );
  });
  it('should create a 2nd group that will be used in a 1st group', async () => {
    await general.delay(1000);
    console.log('\n\n\n');
    group2 = await sdk.group.add({
      label: `Group For Group 1 ${hash}`,
      desc: 'This is some description.',
    });
    ou.eq(
      group2,
      {
        name: `group_for_group_1_${hash}`,
        desc: 'This is some description.',
      },
      'data',
    );
  });
  it('should update the 2nd group', async () => {
    await general.delay(1000);
    console.log('\n\n\n');
    group2 = await sdk.group.update({
      _id: group2._id,
      propChanges: [
        {
          add: {
            label: 'Location',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [],
          },
        },
      ],
    });
  });
  it('should update the 1st group', async () => {
    await general.delay(1000);
    console.log('\n\n\n');
    group = await sdk.group.update({
      _id: group._id,
      propChanges: [
        {
          add: {
            label: 'City',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [],
          },
        },
        {
          add: {
            label: 'Address',
            array: false,
            required: true,
            type: PropType.GROUP_POINTER,
            value: {
              _id: group2._id,
            },
          },
        },
      ],
    });
  });
  it('should create a new template', async () => {
    await general.delay(1000);
    console.log('\n\n\n');
    template = await sdk.template.add({
      label: `Test Template 1# ${hash}`,
      desc: 'This is some description.',
      singleEntry: false,
    });
    ou.eq(
      template,
      {
        name: `test_template_1_${hash}`,
        desc: 'This is some description.',
      },
      'data',
    );
  });
  it('should update the template', async () => {
    await general.delay(1000);
    console.log('\n\n\n');
    template = await sdk.template.update({
      _id: template._id,
      label: `Test Template 1a ${hash}`,
      propChanges: [
        {
          add: {
            label: 'Product Name',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [],
          },
        },
        {
          add: {
            label: 'Group',
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
      name: `test_template_1a_${hash}`,
      desc: 'This is some description.',
      props: [
        {
          label: 'Product Name',
          name: 'product_name',
          array: false,
          required: true,
          type: PropType.STRING,
          value: [],
        },
        {
          label: 'Group',
          name: 'group',
          array: false,
          required: true,
          type: PropType.GROUP_POINTER,
          value: {
            _id: group._id,
            items: [
              {
                props: [
                  {
                    label: 'City',
                    name: 'city',
                    array: false,
                    required: true,
                    type: PropType.STRING,
                    value: [],
                  },
                  {
                    label: 'Address',
                    name: 'address',
                    array: false,
                    required: true,
                    type: PropType.GROUP_POINTER,
                    value: {
                      _id: group2._id,
                      items: [
                        {
                          props: [
                            {
                              label: 'Location',
                              name: 'location',
                              array: false,
                              required: true,
                              type: PropType.STRING,
                              value: [],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    });
  });
  it('should update the 2nd group and check if template is updated', async () => {
    await general.delay(1000);
    console.log('\n\n\n');
    group2 = await sdk.group.update({
      _id: group2._id,
      propChanges: [
        {
          add: {
            label: 'Geo',
            array: false,
            required: true,
            type: PropType.STRING,
            value: [],
          },
        },
      ],
    });
    template = await sdk.template.get(template._id);
    // console.log(JSON.stringify(template, null, '  '));
    ou.eq(template, {
      name: `test_template_1a_${hash}`,
      desc: 'This is some description.',
      props: [
        {
          label: 'Product Name',
          name: 'product_name',
          array: false,
          required: true,
          type: PropType.STRING,
          value: [],
        },
        {
          label: 'Group',
          name: 'group',
          array: false,
          required: true,
          type: PropType.GROUP_POINTER,
          value: {
            _id: group._id,
            items: [
              {
                props: [
                  {
                    label: 'City',
                    name: 'city',
                    array: false,
                    required: true,
                    type: PropType.STRING,
                    value: [],
                  },
                  {
                    label: 'Address',
                    name: 'address',
                    array: false,
                    required: true,
                    type: PropType.GROUP_POINTER,
                    value: {
                      _id: group2._id,
                      items: [
                        {
                          props: [
                            {
                              label: 'Location',
                              name: 'location',
                              array: false,
                              required: true,
                              type: PropType.STRING,
                              value: [],
                            },
                            {
                              label: 'Geo',
                              name: 'geo',
                              array: false,
                              required: true,
                              type: PropType.STRING,
                              value: [],
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    });
  });
  // it('should get the template and check if props are updated', async () => {
  //   template = await sdk.template.get(template._id);
  //   ou.eq(template, {
  //     name: `test_template_1a_${hash}`,
  //     desc: 'This is some description.',
  //     props: [
  //       {
  //         label: 'Product Name',
  //         name: 'product_name',
  //         array: false,
  //         required: true,
  //         type: PropType.STRING,
  //         value: [],
  //       },
  //       {
  //         label: 'Group',
  //         name: 'group',
  //         array: false,
  //         required: true,
  //         type: PropType.GROUP_POINTER,
  //         value: {
  //           _id: group._id,
  //           items: [
  //             {
  //               props: [
  //                 {
  //                   label: 'city',
  //                   name: 'city',
  //                   array: false,
  //                   required: true,
  //                   type: PropType.STRING,
  //                   value: [],
  //                 },
  //                 {
  //                   label: 'Country',
  //                   name: 'country',
  //                   array: false,
  //                   required: true,
  //                   type: PropType.STRING,
  //                   value: [],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       },
  //     ],
  //   });
  // });
  // it('should remove the group and check if template is updated', async () => {
  //   await sdk.group.deleteById(group._id);
  //   template = await sdk.template.get(template._id);
  //   ou.eq(template, {
  //     name: `test_template_1a_${hash}`,
  //     desc: 'This is some description.',
  //     props: [
  //       {
  //         label: 'Product Name',
  //         name: 'product_name',
  //         array: false,
  //         required: true,
  //         type: PropType.STRING,
  //         value: [],
  //       },
  //     ],
  //   });
  // });
});
