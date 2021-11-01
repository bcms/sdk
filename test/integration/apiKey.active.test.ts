import { expect } from 'chai';
import { Login, ObjectUtil, sdk } from '../util';

describe('API Key API', async () => {
  Login();
  it('should create new API Key', async () => {
    const result = await sdk.apiKey.create({
      access: {
        functions: [],
        templates: [],
      },
      blocked: false,
      desc: 'This is test key',
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
        desc: 'This is test key',
        name: 'Test key',
        userId: '111111111111111111111111',
      },
      'apiKey',
    );
  });
});
