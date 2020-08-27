import * as crypto from 'crypto';
import { sdk, Login, ObjectUtil } from './util';
import { Template, Entry, PropType, EntryMeta } from '../src/interfaces';
import { expect } from 'chai';

const hash = crypto.createHash('sha1').update(`${Date.now()}`).digest('hex');
const ou = ObjectUtil();
let template: Template;
let entry: Entry;

describe('Entry functions', async () => {
  Login();
  it('should create a template that will be used to test entries', async () => {
    const data = await sdk.template.add({
      label: 'Tmp ' + hash,
      desc: 'This is some description.',
      singleEntry: false,
    });
    ou.eq(
      data,
      {
        label: 'Tmp ' + hash,
        name: `tmp_${hash}`,
        desc: 'This is some description.',
      },
      'data',
    );
    template = data;
  });
  it('should update the template with some props', async () => {
    const data = await sdk.template.update({
      _id: template._id,
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
            label: 'Product Quantity',
            array: false,
            required: true,
            type: PropType.NUMBER,
            value: [],
          },
        },
      ],
    });
    template = data;
  });
  it('should creat an entry in the template', async () => {
    const meta: EntryMeta[] = [
      {
        lng: 'sr',
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
            label: 'Product Quantity',
            name: 'product_quantity',
            array: false,
            required: true,
            type: PropType.NUMBER,
            value: [],
          },
        ],
      },
      {
        lng: 'en',
        props: [
          {
            label: 'Product Name',
            name: 'product_name',
            array: false,
            required: true,
            type: PropType.STRING,
            value: ['test name'],
          },
          {
            label: 'Product Quantity',
            name: 'product_quantity',
            array: false,
            required: true,
            type: PropType.NUMBER,
            value: [4],
          },
        ],
      },
    ];
    const data = await sdk.entry.add({
      title: 'This is test entry',
      slug: 'Test entry ' + hash,
      templateId: template._id,
      meta,
    });
    ou.eq(
      data,
      {
        title: 'This is test entry',
        slug: `test-entry-${hash}`,
        templateId: template._id,
        meta,
      },
      'data',
    );
    entry = data;
  });
  it('should remove the template', async () => {
    await sdk.template.deleteById(template._id);
    try {
      await sdk.template.get(template._id);
    } catch (error) {
      expect(error.status).to.equal(404);
      return;
    }
    throw new Error(
      `Expected to fail with 404 for getting the` +
        ` Template after its removal.`,
    );
  });
  it('should remove the entry', async () => {
    await sdk.entry.deleteById(entry._id);
    try {
      await sdk.entry.get(template._id);
    } catch (error) {
      expect(error.status).to.equal(404);
      return;
    }
    throw new Error(
      `Expected to fail with 404 for getting the Entry after its removal.`,
    );
  });
});
