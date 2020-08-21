import { expect, assert } from 'chai';
import { sdk, Login, ObjectUtil, env } from './util';
import { User, RoleName, PermissionName } from '../src/interfaces';

const objectUtil = ObjectUtil();

const comparator = {
  defUser: {
    email: env.user,
    roles: [
      {
        name: RoleName.ADMIN,
        permissions: [
          {
            name: PermissionName.READ,
          },
          {
            name: PermissionName.WRITE,
          },
          {
            name: PermissionName.DELETE,
          },
          {
            name: PermissionName.EXECUTE,
          },
        ],
      },
    ],
    username: 'Test Test',
    customPool: {
      personal: {
        firstName: 'Test',
        lastName: 'Test',
        avatarUri: '',
      },
      policy: {
        customPortal: {
          delete: false,
          get: false,
          post: false,
          put: false,
        },
        media: {
          delete: false,
          get: false,
          post: false,
          put: false,
        },
        entries: [],
        webhooks: [],
      },
    },
  },
};

describe('User functions', async () => {
  Login();
  it('should get this user data', async () => {
    const data = await sdk.user.get();
    objectUtil.eq(data, comparator.defUser, 'data');
  });
  it('should get all users', async () => {
    const data = await sdk.user.getAll();
    for (const i in data) {
      objectUtil.checkType(data[i], comparator.defUser, `data[${i}]`);
    }
  });
});
