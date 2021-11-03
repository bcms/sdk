import { expect } from 'chai';
import { Login, ObjectUtil, sdk } from '../util';

describe('Language API', async () => {
  Login();
  let idLanguage: string;

  it('should create new Language', async () => {
    const result = await sdk.language.create({
      code: 'gr',
      name: 'Germany',
      nativeName: 'Germany',
    });
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('_id').to.be.a('string');
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    expect(result).to.have.property('def').to.be.a('boolean');
    ObjectUtil.eq(
      result,
      {
        code: 'gr',
        name: 'Germany',
        nativeName: 'Germany',
        userId: '111111111111111111111111',
      },
      'language',
    );
    idLanguage = result._id;
  });
  it('should show all Language', async () => {
    const results = await sdk.language.getAll();
    expect(results).to.be.a('array');
    expect(results.length).gte(0);
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      expect(result).to.be.instanceOf(Object);
      expect(result).to.have.property('_id').to.be.a('string');
      expect(result).to.have.property('createdAt').to.be.a('number');
      expect(result).to.have.property('updatedAt').to.be.a('number');
      expect(result).to.have.property('code').to.be.a('string');
      expect(result).to.have.property('name').to.be.a('string');
      expect(result).to.have.property('nativeName').to.be.a('string');
      expect(result).to.have.property('def').to.be.a('boolean');
    }
  });
  it('should get number of Languages', async () => {
    const result = await sdk.language.count();
    expect(result).to.be.a('number');
  });
  it('should get a specific Language', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idLanguage).to.be.a('string');
    const result = await sdk.language.get(idLanguage);
    expect(result).to.be.instanceOf(Object);
    expect(result).to.have.property('_id').to.be.a('string').eq(idLanguage);
    expect(result).to.have.property('createdAt').to.be.a('number');
    expect(result).to.have.property('updatedAt').to.be.a('number');
    expect(result).to.have.property('code').to.be.a('string');
    expect(result).to.have.property('name').to.be.a('string');
    expect(result).to.have.property('nativeName').to.be.a('string');
    expect(result).to.have.property('def').to.be.a('boolean');
  });
  it('should delete Language', async () => {
    // eslint-disable-next-line no-unused-expressions
    expect(idLanguage).to.be.a('string');
    const result = await sdk.language.deleteById(idLanguage);
    expect(result).eq('Success.');
  });
});
