import * as crypto from 'crypto';
import { expect } from 'chai';
import { sdk, Login, ObjectUtil } from '../util';
import { Group, PropType } from '../../src/interfaces';
import { GroupSteps as groupSteps } from './steps';

const hash = crypto.createHash('sha1').update(`${Date.now()}`).digest('hex');
const ou = ObjectUtil();
const GroupSteps = groupSteps(sdk, hash, ou);
let group1: Group;
let group2: Group;

describe('Group functions', async () => {
  Login();
  it('should create a 1st group that will be used in 2nd group', async () => {
    group1 = await GroupSteps.create1st(group1);
  });
  it('should create a 2nd', async () => {
    group2 = await GroupSteps.create2nd(group2);
  });
  it('should update props in 2nd group and link 1st group to it', async () => {
    const result = await GroupSteps.update2ndAndLinkTo1st(group1, group2);
    group1 = result.grp1;
    group2 = result.grp2;
  });
  it('should add props to 1st group and check it 2nd group is updated', async () => {
    const result = await GroupSteps.addPropsTo1stAndCheck2nd(group1, group2);
    group1 = result.grp1;
    group2 = result.grp2;
  });
  it('should update and remove props in 1st group and check it 2nd group is updated', async () => {
    const result = await GroupSteps.upAndRemPropsIn1stAndCheck2nd(
      group1,
      group2,
    );
    group1 = result.grp1;
    group2 = result.grp2;
  });
  it('should fail when adding new prop to 1st group with name that exist', async () => {
    try {
      group1 = await sdk.group.update({
        _id: group1._id,
        label: `Social ${hash}`,
        propChanges: [
          {
            add: {
              label: 'Github',
              array: false,
              required: true,
              type: PropType.STRING,
              value: ['https://github.com'],
            },
          },
        ],
      });
    } catch (error) {
      return;
    }
    throw new Error(
      'Expected to fail when trying to add property with name that already exist.',
    );
  });
  it('should fail when updating existing prop in 1st group with name that exist', async () => {
    try {
      group1 = await sdk.group.update({
        _id: group1._id,
        label: `Social ${hash}`,
        propChanges: [
          {
            update: {
              label: {
                old: 'Stack Overflow',
                new: 'Github',
              },
              required: true,
            },
          },
        ],
      });
    } catch (error) {
      return;
    }
    throw new Error(
      'Expected to fail when trying to update prop with name that already exist.',
    );
  });
  it('should delete 1st group and check if 2nd group is updated', async () => {
    await GroupSteps.delete1stAndCheck2nd(group1, group2);
  });
  it('should delete 2nd group', async () => {
    await GroupSteps.delete2nd(group2);
  });
});
