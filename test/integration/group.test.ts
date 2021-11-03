import { expect } from 'chai';
import { Login, ObjectUtil, sdk } from '../util';

describe('Group API', async () => {
  Login();
  let idGroup: string;
  it('should create new Group', async () => {
    const result = await sdk.group.create({
      label: 'group two',
      desc: 'group two',
    });
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('_id').to.be.a('string');
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    expect(result).to.have.property('cid').to.be.a('string');
    expect(result).to.have.property('props').to.be.a('array');
    ObjectUtil.eq(
      result,
      {
        desc: 'group two',
        label: 'group two',
        name: 'group_two',
      },
      'group',
    );
    idGroup = result._id;
  });
  it('should update Group', async () => {
    const result = await sdk.group.update({
      _id: idGroup,
      label: 'group testing',
      desc: 'group testing',
      propChanges: [],
    });
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('_id').to.be.a('string').eq(idGroup);
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    expect(result).to.have.property('cid').to.be.a('string');
    expect(result).to.have.property('props').to.be.a('array');
    ObjectUtil.eq(
      result,
      {
        desc: 'group testing',
        label: 'group testing',
        name: 'group_testing',
      },
      'group',
    );
  });
  it('should show all Groups', async () => {
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
  it('should show many Group', async () => {
    const manyId = [idGroup, idGroup];
    expect(manyId).to.be.a('array');
    const results = await sdk.group.getMany(manyId);
    expect(results).to.be.a('array');
    expect(results.length).gte(0);
    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < manyId.length; j++) {
        const result = results[i];
        expect(result).to.be.instanceOf(Object);
        expect(result).to.have.property('_id').to.be.a('string').eq(manyId[j]);
        expect(result).to.have.property('createdAt').to.be.a('number');
        expect(result).to.have.property('updatedAt').to.be.a('number');
        expect(result).to.have.property('cid').to.be.a('string');
        expect(result).to.have.property('label').to.be.a('string');
        expect(result).to.have.property('name').to.be.a('string');
        expect(result).to.have.property('desc').to.be.a('string');
        expect(result).to.have.property('props').to.be.a('array');
      }
    }
  });
  it('should get number of Group', async () => {
    const result = await sdk.group.count();
    expect(result).to.be.a('number');
  });
  it('should get where is use Group', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idGroup).to.be.a('string');
    const result = await sdk.group.whereIsItUsed(idGroup);
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('templateIds').to.be.a('array');
    expect(result).to.have.property('groupIds').to.be.a('array');
    expect(result).to.have.property('widgetIds').to.be.a('array');
  });
  it('should get a specific Group', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idGroup).to.be.a('string');
    const result = await sdk.group.get(idGroup);
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('_id').to.be.a('string').eq(idGroup);
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    expect(result).to.have.property('cid').to.be.a('string');
    expect(result).to.have.property('label').to.be.a('string');
    expect(result).to.have.property('name').to.be.a('string');
    expect(result).to.have.property('desc').to.be.a('string');
    expect(result).to.have.property('props').to.be.a('array');
  });
  it('should get a lite Groups', async () => {
    // eslint-disable-next-line no-unused-expressions
    const results = await sdk.group.getAllLite();
    expect(results).to.be.a('array');
    expect(results.length).gte(0);
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      expect(result).to.be.instanceOf(Object);
      expect(result).to.have.property('cid').to.be.a('string');
      expect(result).to.have.property('label').to.be.a('string');
      expect(result).to.have.property('name').to.be.a('string');
      expect(result).to.have.property('desc').to.be.a('string');
      expect(result).to.have.property('propsCount').to.be.a('number');
    }
  });
  it('should delete Group', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idGroup).to.be.a('string');
    const result = await sdk.group.deleteById(idGroup);
    expect(result).eq('Success.');
  });
});
