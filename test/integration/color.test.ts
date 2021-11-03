import { expect } from 'chai';
import { Login, ObjectUtil, sdk } from '../util';

describe('Color API', async () => {
  Login();
  let idColor: string;
  let sourceId: string;
  let sourceType: string;
  it('should create new Color', async () => {
    const result = await sdk.color.create({
      label: 'black',
      value: '#030504',
      source: {
        id: '6177ee6d1059eafcacd1cf00',
        type: 'template',
      },
    });
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('_id').to.be.a('string');
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    expect(result).to.have.property('cid').to.be.a('string');
    ObjectUtil.eq(
      result,
      {
        label: 'black',
        name: 'black',
        value: '#030504',
        userId: '111111111111111111111111',
        source: { id: '6177ee6d1059eafcacd1cf00', type: 'template' },
      },
      'color',
    );
    idColor = result._id;
    sourceId = result.source.id;
    sourceType = result.source.type;
  });
  it('should update Color', async () => {
    const result = await sdk.color.update({
      _id: idColor,
      label: 'Blue',
      value: '#1155ff',
    });
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('_id').to.be.a('string').eq(idColor);
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    ObjectUtil.eq(
      result,
      {
        label: 'Blue',
        name: 'blue',
        value: '#1155ff',
        userId: '111111111111111111111111',
        source: { id: sourceId, type: sourceType },
      },
      'color',
    );
  });
  it('should show all Colors', async () => {
    const results = await sdk.color.getAll();
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
      expect(result).to.have.property('value').to.be.a('string');
      expect(result).to.have.property('source').to.be.a('object');
      expect(result).to.have.property('userId').to.be.a('string');
    }
  });
  it('should show many Colors', async () => {
    const manyId = [idColor, idColor];
    expect(manyId).to.be.a('array');
    const results = await sdk.color.getMany(manyId);
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
        expect(result).to.have.property('value').to.be.a('string');
        expect(result).to.have.property('source').to.be.a('object');
        expect(result).to.have.property('userId').to.be.a('string');
      }
    }
  });
  it('should get number of Colors', async () => {
    const result = await sdk.color.count();
    expect(result).to.be.a('number');
  });
  it('should get a specific Color', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idColor).to.be.a('string');
    const result = await sdk.color.get(idColor);
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('_id').to.be.a('string').eq(idColor);
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    expect(result).to.have.property('cid').to.be.a('string');
    expect(result).to.have.property('label').to.be.a('string');
    expect(result).to.have.property('name').to.be.a('string');
    expect(result).to.have.property('value').to.be.a('string');
    expect(result).to.have.property('source').to.be.a('object');
    expect(result).to.have.property('userId').to.be.a('string');
  });
  it('should delete Color', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idColor).to.be.a('string');
    const result = await sdk.color.deleteById(idColor);
    expect(result).eq('Success.');
  });
});
