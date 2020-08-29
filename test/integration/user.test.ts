import { expect, assert } from 'chai';
import { sdk, Login, ObjectUtil, env } from '../util';
import { User, RoleName, PermissionName } from '../../src/interfaces';

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
  newUser: {
    _id: '',
    username: 'Test Test 2',
    email: 'test2@test.com',
    customPool: {
      personal: {
        firstName: 'Test',
        lastName: 'Test 2',
      },
    },
  },
};
let userToAdminData: User;

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
  it('should create a new user', async () => {
    const data = await sdk.user.add({
      email: comparator.newUser.email,
      password: 'password1234',
      customPool: comparator.newUser.customPool,
    });
    comparator.newUser._id = data._id;
    objectUtil.eq(data, comparator.newUser, 'data');
  });
  it('should update new user', async () => {
    const data = await sdk.user.update({
      _id: comparator.newUser._id,
      customPool: {
        personal: {
          firstName: 'Test 2',
          lastName: 'Test',
        },
      },
    });
    objectUtil.eq(
      data,
      {
        username: 'Test 2 Test',
        customPool: {
          personal: {
            firstName: 'Test 2',
            lastName: 'Test',
          },
        },
      },
      'data',
    );
  });
  it('should delete new user', async () => {
    await sdk.user.delete(comparator.newUser._id);
  });
  it('should create a new user', async () => {
    const data = await sdk.user.add({
      email: comparator.newUser.email,
      password: 'password1234',
      customPool: comparator.newUser.customPool,
    });
    userToAdminData = data;
    delete userToAdminData.createdAt;
    delete userToAdminData.updatedAt;
  });
  it('should make a new user an ADMIN', async () => {
    const data = await sdk.user.makeAnAdmin(userToAdminData._id);
    userToAdminData.roles[0].name = RoleName.ADMIN;
    objectUtil.eq(data, userToAdminData, 'data');
  });
  it('should delete new ADMIN user', async () => {
    await sdk.user.delete(userToAdminData._id);
  });
});
