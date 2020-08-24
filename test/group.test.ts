import { expect } from 'chai';
import { sdk, Login, ObjectUtil } from './util';
import { Group } from '../src/interfaces';

const ou = ObjectUtil();
let group: Group;

describe('Group functions', async () => {
  Login();
  it('should create a new group', async () => {
    const data = await sdk.group.add({
      name: 'Test Group 1#',
      desc: 'This is some description.',
    });
    ou.eq(
      data,
      {
        name: 'test-group-1',
        desc: 'This is some description.',
      },
      'data',
    );
    group = data;
  });
  // it('should update group name and description', async () => {

  // })
});
