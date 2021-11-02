import { expect } from 'chai';
import { Login, ObjectUtil, sdk } from '../util';

describe('API Key API', async () => {
  Login();
  let idApiKey: string;
  it('should create new API Key', async () => {
    const result = await sdk.apiKey.create({
      access: {
        functions: [],
        templates: [],
      },
      blocked: false,
      desc: 'This is test key all',
      name: 'Test key',
    });
    expect(result).to.have.property('_id').to.be.a('string');
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    expect(result).to.have.property('secret').to.be.a('string');
    ObjectUtil.eq(
      result,
      {
        access: { functions: [], templates: [] },
        blocked: false,
        desc: 'This is test key all',
        name: 'Test key',
        userId: '111111111111111111111111',
      },
      'apiKey',
    );
    idApiKey = result._id;
  });
  it('should update API Key', async () => {
    const result = await sdk.apiKey.update({
      _id: idApiKey,
      access: {
        functions: [],
        templates: [],
      },
      blocked: false,
      desc: 'This is update key all',
      name: 'Update key',
    });
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('_id').to.be.a('string').eq(idApiKey);
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    expect(result).to.have.property('secret').to.be.a('string');
    ObjectUtil.eq(
      result,
      {
        access: { functions: [], templates: [] },
        blocked: false,
        desc: 'This is update key all',
        name: 'Update key',
        userId: '111111111111111111111111',
      },
      'apiKey',
    );
  });
  it('should show all API Keys', async () => {
    const results = await sdk.apiKey.getAll();
    expect(results).to.be.a('array');
    expect(results.length).gte(0);
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      expect(result).to.be.instanceOf(Object);
      expect(result).to.have.property('_id').to.be.a('string');
      expect(result).to.have.property('createdAt').to.be.a('number');
      expect(result).to.have.property('updatedAt').to.be.a('number');
      expect(result).to.have.property('secret').to.be.a('string');
      expect(result).to.have.property('access').to.be.a('object');
      expect(result).to.have.property('blocked').to.be.a('boolean');
      expect(result).to.have.property('desc').to.be.a('string');
      expect(result).to.have.property('name').to.be.a('string');
      expect(result).to.have.property('userId').to.be.a('string');
    }
  });
  it('should get number of API Keys', async () => {
    const result = await sdk.apiKey.count();
    expect(result).to.be.a('number');
  });
  it('should get a specific API Key ', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idApiKey).to.be.not.null;
    const result = await sdk.apiKey.get(idApiKey);
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('_id').to.be.a('string');
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    expect(result).to.have.property('secret').to.be.a('string');
    expect(result).to.have.property('access').to.be.a('object');
    expect(result).to.have.property('blocked').to.be.a('boolean');
    expect(result).to.have.property('desc').to.be.a('string');
    expect(result).to.have.property('name').to.be.a('string');
    expect(result).to.have.property('userId').to.be.a('string');
  });
  it('should delete API Key', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idApiKey).to.be.not.null;
    const result = await sdk.apiKey.deleteById(idApiKey);
    expect(result).eq('Success.');
  });
});
