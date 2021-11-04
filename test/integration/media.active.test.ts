import { expect } from 'chai';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Login, ObjectUtil, sdk } from '../util';

let mediaId = '';

describe('Media API', async () => {
  Login();
  it('should create upload test.jpeg', async () => {
    const file = await fs.readFile(
      path.join(__dirname, '..', 'assets', 'test.jpeg'),
    );
    const media = await sdk.media.createFile({
      file,
      fileName: 'test.jpeg',
    });
    mediaId = media._id;
    ObjectUtil.eq(
      media,
      {
        hasChildren: false,
        isInRoot: true,
        mimetype: 'image/jpeg',
        name: 'test.jpeg',
        parentId: '',
        size: 63655,
        type: 'IMG',
        userId: '111111111111111111111111',
        altText: '',
        caption: '',
        height: 700,
        width: 1120,
      },
      'media',
    );
  });

  it('should delete test.jpeg', async () => {
    await sdk.media.deleteById(mediaId);
    try {
      await sdk.media.getById(mediaId);
      throw Error('Media is still available after deleting it.');
    } catch (error) {
      expect(error).to.be.an('object').to.have.property('code').to.eq('mda001');
    }
  });
});
