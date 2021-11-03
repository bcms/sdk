import * as fs from 'fs/promises';
import * as path from 'path';
import { Login, sdk } from '../util';

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
  });

  it('should delete test.jpeg', async () => {
    await sdk.media.deleteById(mediaId);
  });
});
