import { expect } from 'chai';
// import { BCMSPropType } from '../../src/types';
import { Login, ObjectUtil, sdk } from '../util';

describe('Entry API', async () => {
  Login();
  let idTemplate: string;
  let idEntry: string;
  let idEntrySecond: string;
  let propIdFirst: string;
  let propIdSecond: string;
  it('should create an entry', async () => {
    const template = await sdk.template.create({
      label: 'Template',
      desc: 'Template',
      singleEntry: true,
    });

    idTemplate = template._id;
    expect(template).to.be.instanceOf(Object);
    expect(template).to.have.property('_id').to.be.a('string');
    expect(template).to.have.property('createdAt').to.be.a('number');
    expect(template).to.have.property('updatedAt').to.be.a('number');
    expect(template).to.have.property('cid').to.be.a('string');
    expect(template).to.have.property('props').to.be.a('array');
    expect(template.props[0]).to.have.property('id').to.be.a('string');
    expect(template.props[1]).to.have.property('id').to.be.a('string');
    ObjectUtil.eq(
      template,
      {
        name: 'template',
        label: 'Template',
        desc: 'Template',
        singleEntry: true,
        userId: '111111111111111111111111',
        props: [
          {
            label: 'Title',
            name: 'title',
            array: false,
            required: true,
            type: 'STRING',
            defaultData: [''],
          },
          {
            label: 'Slug',
            name: 'slug',
            array: false,
            required: true,
            type: 'STRING',
            defaultData: [''],
          },
        ],
      },
      'template',
    );
    const entry = await sdk.entry.create({
      templateId: idTemplate,
      status: '',
      meta: [
        {
          lng: 'en',
          props: [
            {
              id: template.props[0].id,
              data: ['Test'],
            },
            {
              id: template.props[1].id,
              data: ['Test2'],
            },
          ],
        },
      ],
      content: [{ lng: 'en', nodes: [] }],
    });
    idEntry = entry._id;
    propIdFirst = entry.meta[0].props[0].id;
    propIdSecond = entry.meta[0].props[1].id;
    expect(entry).to.be.instanceOf(Object);
    expect(entry).to.have.property('_id').to.be.a('string');
    expect(entry).to.have.property('createdAt').to.be.a('number');
    expect(entry).to.have.property('updatedAt').to.be.a('number');
    expect(entry).to.have.property('cid').to.be.a('string');
    expect(entry)
      .to.have.property('templateId')
      .to.be.a('string')
      .eq(idTemplate);
    expect(entry.meta[0]).to.have.property('props').to.be.a('array');
    expect(entry.meta[0].props[0])
      .to.have.property('id')
      .to.be.a('string')
      .eq(template.props[0].id);
    expect(entry.meta[0].props[1])
      .to.have.property('id')
      .to.be.a('string')
      .eq(template.props[1].id);
    ObjectUtil.eq(
      entry,
      {
        status: '',
        userId: '111111111111111111111111',
        meta: [
          {
            lng: 'en',
            props: [
              {
                data: ['Test'],
              },
              {
                data: ['Test2'],
              },
            ],
          },
        ],
        content: [{ lng: 'en', nodes: [] }],
      },
      'entry',
    );
    const entrySecond = await sdk.entry.create({
      templateId: idTemplate,
      status: '',
      meta: [
        {
          lng: 'en',
          props: [
            {
              id: template.props[0].id,
              data: ['Second'],
            },
            {
              id: template.props[1].id,
              data: ['Second'],
            },
          ],
        },
      ],
      content: [{ lng: 'en', nodes: [] }],
    });
    idEntrySecond = entrySecond._id;
    expect(entrySecond).to.be.instanceOf(Object);
    expect(entrySecond).to.have.property('_id').to.be.a('string');
    expect(entrySecond).to.have.property('createdAt').to.be.a('number');
    expect(entrySecond).to.have.property('updatedAt').to.be.a('number');
    expect(entrySecond).to.have.property('cid').to.be.a('string');
    expect(entrySecond)
      .to.have.property('templateId')
      .to.be.a('string')
      .eq(idTemplate);
    expect(entrySecond.meta[0]).to.have.property('props').to.be.a('array');
    expect(entrySecond.meta[0].props[0])
      .to.have.property('id')
      .to.be.a('string')
      .eq(template.props[0].id);
    expect(entrySecond.meta[0].props[1])
      .to.have.property('id')
      .to.be.a('string')
      .eq(template.props[1].id);
    ObjectUtil.eq(
      entrySecond,
      {
        status: '',
        userId: '111111111111111111111111',
        meta: [
          {
            lng: 'en',
            props: [
              {
                data: ['Second'],
              },
              {
                data: ['Second'],
              },
            ],
          },
        ],
        content: [{ lng: 'en', nodes: [] }],
      },
      'entry',
    );
  });
  it('should be able to update an entry', async () => {
    const updateEntry = await sdk.entry.update({
      _id: idEntry,
      templateId: idTemplate,
      status: '',
      meta: [
        {
          lng: 'en',
          props: [
            {
              id: propIdFirst,
              data: ['Update test'],
            },
            {
              id: propIdSecond,
              data: ['Test2'],
            },
          ],
        },
      ],
      content: [{ lng: 'en', nodes: [] }],
    });
    expect(updateEntry).to.be.instanceOf(Object);
    expect(updateEntry).to.have.property('_id').to.be.a('string');
    expect(updateEntry).to.have.property('createdAt').to.be.a('number');
    expect(updateEntry).to.have.property('updatedAt').to.be.a('number');
    expect(updateEntry).to.have.property('cid').to.be.a('string');
    expect(updateEntry)
      .to.have.property('templateId')
      .to.be.a('string')
      .eq(idTemplate);
    expect(updateEntry.meta[0]).to.have.property('props').to.be.a('array');
    expect(updateEntry.meta[0].props[0])
      .to.have.property('id')
      .to.be.a('string')
      .eq(propIdFirst);
    expect(updateEntry.meta[0].props[1])
      .to.have.property('id')
      .to.be.a('string')
      .eq(propIdSecond);
    ObjectUtil.eq(
      updateEntry,
      {
        status: '',
        userId: '111111111111111111111111',
        meta: [
          {
            lng: 'en',
            props: [
              {
                data: ['Update test'],
              },
              {
                data: ['Test2'],
              },
            ],
          },
        ],
        content: [{ lng: 'en', nodes: [] }],
      },
      'entry',
    );
  });
  it(' should get number of entries by template ID', async () => {
    const result = await sdk.entry.count({ templateId: idTemplate });
    expect(result).to.be.a('number');
  });
  it('should get an entry', async () => {
    const entry = await sdk.entry.get({
      templateId: idTemplate,
      entryId: idEntry,
    });
    expect(entry).to.be.instanceOf(Object);
    expect(entry).to.have.property('_id').to.be.a('string');
    expect(entry).to.have.property('createdAt').to.be.a('number');
    expect(entry).to.have.property('updatedAt').to.be.a('number');
    expect(entry).to.have.property('cid').to.be.a('string');
    expect(entry)
      .to.have.property('templateId')
      .to.be.a('string')
      .eq(idTemplate);
    expect(entry.meta[0]).to.have.property('props').to.be.a('array');
    expect(entry.meta[0].props[0])
      .to.have.property('id')
      .to.be.a('string')
      .eq(propIdFirst);
    expect(entry.meta[0].props[1])
      .to.have.property('id')
      .to.be.a('string')
      .eq(propIdSecond);
    ObjectUtil.eq(
      entry,
      {
        status: '',
        userId: '111111111111111111111111',
        meta: [
          {
            lng: 'en',
            props: [
              {
                data: ['Update test'],
              },
              {
                data: ['Test2'],
              },
            ],
          },
        ],
        content: [{ lng: 'en', nodes: [] }],
      },
      'entry',
    );
  });
  it('should get an entry with Lite model', async () => {
    const entryLite = await sdk.entry.getLite({
      templateId: idTemplate,
      entryId: idEntry,
    });
    expect(entryLite).to.be.instanceOf(Object);
    expect(entryLite).to.have.property('_id').to.be.a('string');
    expect(entryLite).to.have.property('createdAt').to.be.a('number');
    expect(entryLite).to.have.property('updatedAt').to.be.a('number');
    expect(entryLite).to.have.property('cid').to.be.a('string');
    expect(entryLite)
      .to.have.property('templateId')
      .to.be.a('string')
      .eq(idTemplate);
    expect(entryLite.meta[0]).to.have.property('props').to.be.a('array');
    expect(entryLite.meta[0].props[0])
      .to.have.property('id')
      .to.be.a('string')
      .eq(propIdFirst);
    expect(entryLite.meta[0].props[1])
      .to.have.property('id')
      .to.be.a('string')
      .eq(propIdSecond);
    ObjectUtil.eq(
      entryLite,
      {
        userId: '111111111111111111111111',
        meta: [
          {
            lng: 'en',
            props: [
              {
                data: ['Update test'],
              },
              {
                data: ['Test2'],
              },
            ],
          },
        ],
      },
      'entry',
    );
  });
  it('should get many entries with Lite models in 1 request', async () => {
    const entryLites = await sdk.entry.getManyLite({
      templateId: idTemplate,
      entryIds: [idEntry, idEntrySecond],
    });
    for (let i = 0; i < entryLites.length; i++) {
      const entryLite = entryLites[i];
      expect(entryLite).to.be.instanceOf(Object);
      expect(entryLite).to.have.property('_id').to.be.a('string');
      expect(entryLite).to.have.property('createdAt').to.be.a('number');
      expect(entryLite).to.have.property('updatedAt').to.be.a('number');
      expect(entryLite).to.have.property('cid').to.be.a('string');
      expect(entryLite)
        .to.have.property('templateId')
        .to.be.a('string')
        .eq(idTemplate);
      expect(entryLite)
        .to.have.property('userId')
        .to.be.a('string')
        .eq('111111111111111111111111');
      expect(entryLite).to.have.property('meta').to.be.a('array');
      expect(entryLite.meta[0]).to.have.property('props').to.be.a('array');
      expect(entryLite.meta[0].props[0])
        .to.have.property('id')
        .to.be.a('string');
      expect(entryLite.meta[0].props[0])
        .to.have.property('data')
        .to.be.a('array');
      expect(entryLite.meta[0].props[1])
        .to.have.property('id')
        .to.be.a('string');
      expect(entryLite.meta[0].props[1])
        .to.have.property('data')
        .to.be.a('array');
    }
  });
  it('should get all entries with Lite models by template ID', async () => {
    const entryLites = await sdk.entry.getAllLite({
      templateId: idTemplate,
    });
    for (let i = 0; i < entryLites.length; i++) {
      const entryLite = entryLites[i];
      expect(entryLite).to.be.instanceOf(Object);
      expect(entryLite).to.have.property('_id').to.be.a('string');
      expect(entryLite).to.have.property('createdAt').to.be.a('number');
      expect(entryLite).to.have.property('updatedAt').to.be.a('number');
      expect(entryLite).to.have.property('cid').to.be.a('string');
      expect(entryLite)
        .to.have.property('templateId')
        .to.be.a('string')
        .eq(idTemplate);
      expect(entryLite)
        .to.have.property('userId')
        .to.be.a('string')
        .eq('111111111111111111111111');
      expect(entryLite).to.have.property('meta').to.be.a('array');
      expect(entryLite.meta[0]).to.have.property('props').to.be.a('array');
      expect(entryLite.meta[0].props[0])
        .to.have.property('id')
        .to.be.a('string');
      expect(entryLite.meta[0].props[0])
        .to.have.property('data')
        .to.be.a('array');
      expect(entryLite.meta[0].props[1])
        .to.have.property('id')
        .to.be.a('string');
      expect(entryLite.meta[0].props[1])
        .to.have.property('data')
        .to.be.a('array');
    }
  });
  it('should be able to delete an entry', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idEntry).to.be.a('string');
    const result = await sdk.entry.deleteById({
      templateId: idTemplate,
      entryId: idEntry,
    });
    expect(result).eq('Success.');
    expect(idTemplate).to.be.a('string');
    const deleteTemplate = await sdk.template.deleteById(idTemplate);
    expect(deleteTemplate).eq('Success.');
  });
  // let idGroup: string;
  // it('should create a data which will be used in next tests', async() =>{
  //   const group = await sdk.group.create({
  //     label: 'group first',
  //     desc: 'group first',
  //   });
  //   idGroup = group._id;
  //   expect(group).to.be.instanceOf(Object);
  //   expect(group).to.have.property('_id').to.be.a('string');
  //   expect(group).to.have.property('createdAt').to.be.a('number');
  //   expect(group).to.have.property('updatedAt').to.be.a('number');
  //   expect(group).to.have.property('cid').to.be.a('string');
  //   expect(group).to.have.property('props').to.be.a('array');
  //   ObjectUtil.eq(
  //     group,
  //     {
  //       desc: 'group first',
  //       label: 'group first',
  //       name: 'group_first',
  //     },
  //     'group',
  //   );
  //   const updateGroup = await sdk.group.update({
  //     _id: idGroup,
  //     propChanges: [
  //       {
  //         add: {
  //           label: 'First string',
  //           type: BCMSPropType.STRING,
  //           required: true,
  //           array: false,
  //           defaultData: ['This is first string'],
  //         },
  //       },
  //     ],
  //   });
  //   expect(updateGroup).to.be.instanceOf(Object);
  //   expect(updateGroup).to.have.property('_id').to.be.a('string').eq(idGroup);
  //   expect(updateGroup).to.have.property('createdAt').to.be.a('number');
  //   expect(updateGroup).to.have.property('updatedAt').to.be.a('number');
  //   expect(updateGroup).to.have.property('cid').to.be.a('string');
  //   expect(updateGroup).to.have.property('props').to.be.a('array');
  //   expect(updateGroup.props[0]).to.have.property('id').to.be.a('string');
  //   expect(updateGroup.props[0]).to.have.deep.property('defaultData', [
  //     'This is first string',
  //   ]);
  //   ObjectUtil.eq(
  //     updateGroup,
  //     {
  //       desc: 'group testing',
  //       label: 'group testing',
  //       name: 'group_testing',
  //       props: [
  //         {
  //           name: 'first_string',
  //           label: 'First string',
  //           array: false,
  //           required: true,
  //           type: 'STRING',
  //         },
  //       ],
  //     },
  //     'group',
  //   );

  // })
});
