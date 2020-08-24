import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import { Login, sdk, ObjectUtil } from './util';
import * as FormData from 'form-data';
import { Media } from '../src/interfaces';

const mediaTemplate = {
  hasChildren: true,
  isInRoot: false,
  mimetype: '',
  name: '',
  parentId: '',
  size: 0,
  type: '',
  userId: '',
};
const ou = ObjectUtil();
let dir1: Media;
let dir2: Media;
let media1: Media;
let media2: Media;

describe('Media functions', async () => {
  Login();
  it('should create a new directory called "dir1"', async () => {
    const data = await sdk.media.addDir({
      name: 'dir1',
    });
    ou.checkType(data, mediaTemplate, 'data');
    dir1 = data;
  });
  it('should create a new directory called "dir2" inside of "dir1"', async () => {
    const data = await sdk.media.addDir({
      name: 'dir2',
      parentId: dir1._id,
    });
    ou.checkType(data, mediaTemplate, 'data');
    dir2 = data;
  });
  it('should create a new file inside of the root', async () => {
    const buffer = await util.promisify(fs.readFile)(
      path.join(__dirname, 'assets', 'test.jpeg'),
    );
    const fd = new FormData();
    fd.append('media', buffer, 'test.jpeg');
    const data = await sdk.media.addFile(fd as any);
    ou.checkType(data, mediaTemplate, 'data');
    media1 = data;
  });
  it('should create a new file inside of the "dir2"', async () => {
    const buffer = await util.promisify(fs.readFile)(
      path.join(__dirname, 'assets', 'test.jpeg'),
    );
    const fd = new FormData();
    fd.append('media', buffer, 'test.jpeg');
    const data = await sdk.media.addFile(fd as any, dir2._id);
    ou.checkType(data, mediaTemplate, 'data');
    media2 = data;
  });
  it('should get all media aggregated', async () => {
    const data = await sdk.media.getAllAggregated();
    ou.eq(
      data,
      [
        {
          _id: dir1._id,
          isInRoot: true,
          mimetype: 'dir',
          name: 'dir1',
          path: '/dir1',
          size: 0,
          state: false,
          type: 'DIR',
          children: [
            {
              _id: dir2._id,
              isInRoot: false,
              mimetype: 'dir',
              name: 'dir2',
              path: '/dir1/dir2',
              state: false,
              type: 'DIR',
              children: [
                {
                  _id: media2._id,
                  isInRoot: false,
                  mimetype: 'image/jpeg',
                  name: 'test.jpeg',
                  path: '/dir1/dir2',
                  state: false,
                  type: 'IMG',
                },
              ],
            },
          ],
        },
        {
          _id: media1._id,
          isInRoot: true,
          mimetype: 'image/jpeg',
          name: 'test.jpeg',
          path: '/',
          size: 63655,
          state: false,
          type: 'IMG',
        },
      ],
      'data',
    );
  });
  it('should get "dir2" aggregated', async () => {
    const data = await sdk.media.getAggregated(dir2._id);
    ou.eq(
      data,
      {
        _id: dir2._id,
        isInRoot: false,
        mimetype: 'dir',
        name: 'dir2',
        path: '/dir1/dir2',
        state: false,
        type: 'DIR',
        children: [
          {
            _id: media2._id,
            isInRoot: false,
            mimetype: 'image/jpeg',
            name: 'test.jpeg',
            path: '/dir1/dir2',
            state: false,
            type: 'IMG',
          },
        ],
      },
      'data',
    );
  });
  it('should delete "media2"', async () => {
    await sdk.media.deleteById(media1._id);
  });
  it('should delete "dir1"', async () => {
    await sdk.media.deleteById(dir1._id);
  });
});
