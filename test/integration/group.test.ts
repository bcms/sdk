import { expect } from 'chai';
import { Login, ObjectUtil, sdk } from '../util';

describe('Group API', async () => {
  Login();
  let idGroup: string;
  let cidGroup: string;
  it('should be able to create a group', async () => {
    const group = await sdk.group.create({
      label: 'group two',
      desc: 'group two',
    });
    idGroup = group._id;
    cidGroup = group.cid;
    expect(group).to.be.instanceOf(Object);
    expect(group).to.have.property('_id').to.be.a('string');
    expect(group).to.have.property('createdAt').to.be.a('number');
    expect(group).to.have.property('updatedAt').to.be.a('number');
    expect(group).to.have.property('cid').to.be.a('string');
    expect(group).to.have.property('props').to.be.a('array');
    ObjectUtil.eq(
      group,
      {
        desc: 'group two',
        label: 'group two',
        name: 'group_two',
      },
      'group',
    );
  });
  it('should be able to update group', async () => {
    const updateGroup = await sdk.group.update({
      _id: idGroup,
      label: 'group testing',
      desc: 'group testing',
      propChanges: [],
    });
    expect(updateGroup).to.be.instanceOf(Object);
    expect(updateGroup).to.have.property('_id').to.be.a('string').eq(idGroup);
    expect(updateGroup).to.have.property('createdAt').to.be.a('number');
    expect(updateGroup).to.have.property('updatedAt').to.be.a('number');
    expect(updateGroup).to.have.property('cid').to.be.a('string');
    expect(updateGroup).to.have.property('props').to.be.a('array');
    ObjectUtil.eq(
      updateGroup,
      {
        desc: 'group testing',
        label: 'group testing',
        name: 'group_testing',
      },
      'group',
    );
  });
  it('should show all groups', async () => {
    const results = await sdk.group.getAll();
    expect(results).to.be.a('array');
    expect(results.length).gte(0);
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      expect(result).to.be.instanceOf(Object);
      expect(result).to.have.property('_id').to.be.a('string');
      expect(result).to.have.property('createdAt').to.be.a('number');
      expect(result).to.have.property('updatedAt').to.be.a('number');
      expect(result).to.have.property('cid').to.be.a('string');
      expect(result).to.have.property('label').to.be.a('string');
      expect(result).to.have.property('name').to.be.a('string');
      expect(result).to.have.property('desc').to.be.a('string');
      expect(result).to.have.property('props').to.be.a('array');
    }
  });
  it('should be able to get many groups in 1 request', async () => {
    const manyId = [cidGroup, cidGroup];
    expect(manyId).to.be.a('array');
    const groups = await sdk.group.getMany(manyId);
    expect(groups).to.be.a('array');
    expect(groups.length).gte(0);
    for (let i = 0; i < groups.length; i++) {
      for (let j = 0; j < manyId.length; j++) {
        const group = groups[i];
        expect(group).to.be.instanceOf(Object);
        expect(group).to.have.property('_id').to.be.a('string');
        expect(group).to.have.property('createdAt').to.be.a('number');
        expect(group).to.have.property('updatedAt').to.be.a('number');
        expect(group).to.have.property('cid').to.be.a('string').eq(manyId[j]);
        expect(group).to.have.property('label').to.be.a('string');
        expect(group).to.have.property('name').to.be.a('string');
        expect(group).to.have.property('desc').to.be.a('string');
        expect(group).to.have.property('props').to.be.a('array');
      }
    }
  });
  it('should get how many groups are available', async () => {
    const result = await sdk.group.count();
    expect(result).to.be.a('number');
  });
  it('should get where is use group', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idGroup).to.be.a('string');
    const whereUseGroup = await sdk.group.whereIsItUsed(idGroup);
    expect(whereUseGroup).to.be.instanceOf(Object);
    expect(whereUseGroup).to.have.property('templateIds').to.be.a('array');
    expect(whereUseGroup).to.have.property('groupIds').to.be.a('array');
    expect(whereUseGroup).to.have.property('widgetIds').to.be.a('array');
  });
  it('should be able to get a group', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idGroup).to.be.a('string');
    const group = await sdk.group.get(idGroup);
    expect(group).to.be.instanceOf(Object);
    expect(group).to.have.property('_id').to.be.a('string').eq(idGroup);
    expect(group).to.have.property('createdAt').to.be.a('number');
    expect(group).to.have.property('updatedAt').to.be.a('number');
    expect(group).to.have.property('cid').to.be.a('string');
    expect(group).to.have.property('label').to.be.a('string');
    expect(group).to.have.property('name').to.be.a('string');
    expect(group).to.have.property('desc').to.be.a('string');
    expect(group).to.have.property('props').to.be.a('array');
  });
  it('should be able to get a lite group', async () => {
    // eslint-disable-next-line no-unused-expressions
    const groups = await sdk.group.getAllLite();
    expect(groups).to.be.a('array');
    expect(groups.length).gte(0);
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      expect(group).to.be.instanceOf(Object);
      expect(group).to.have.property('cid').to.be.a('string');
      expect(group).to.have.property('label').to.be.a('string');
      expect(group).to.have.property('name').to.be.a('string');
      expect(group).to.have.property('desc').to.be.a('string');
      expect(group).to.have.property('propsCount').to.be.a('number');
    }
  });
  it('should be able to delete a group', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idGroup).to.be.a('string');
    const result = await sdk.group.deleteById(idGroup);
    expect(result).eq('Success.');
  });
});
