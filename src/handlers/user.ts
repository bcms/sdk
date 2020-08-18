import { User, UserPolicyCRUD, Storage, JWT } from '../interfaces';
import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';
import { Queueable } from '../util';

export interface UserHandlerPrototype {
  /**
   * Get all CMS Users.
   */
  getAll(): Promise<User[]>;
  /**
   * Get single CMS User. If parameter `id` is not provided,
   * User that is sending a request will be returned.
   */
  get(id?: string): Promise<User>;
  /**
   * Update specified User information. Have in mind that some
   * properties are protected and accessible only by ADMIN User
   * (for ex. `data.customPool.policy.*`).
   */
  update(data: {
    _id: string;
    email?: string;
    password?: {
      current: string;
      new: string;
    };
    customPool?: {
      personal?: {
        firstName?: string;
        lastName?: string;
      };
      address?: {
        country?: string;
        city?: string;
        state?: string;
        zip?: string;
        street?: {
          name?: string;
          number?: string;
        };
      };
      policy?: {
        media?: UserPolicyCRUD;
        customPortal?: UserPolicyCRUD;
        entries?: Array<UserPolicyCRUD & { _id: string }>;
        webhooks?: Array<
          UserPolicyCRUD & {
            _id: string;
          }
        >;
      };
    };
  }): Promise<User>;
  /**
   * Add new User to the CMS. Have in mind that only ADMIN User
   * can call this method successfully.
   */
  add(data: {
    email: string;
    password: string;
    customPool: {
      personal: {
        firstName: string;
        lastName: string;
      };
    };
  }): Promise<User>;
  /**
   * Upgrade specified User role from USER to an ADMIN. Have in
   * mind that only ADMIN User can call this method successfully.
   */
  makeAnAdmin(id: string): Promise<User>;
  /**
   * If there are no ADMIN Users in the database, by calling this
   * method, admin secret will be generated on the server and
   * printed to console. This secret is needed to calling
   * `createAdmin` method.
   */
  generateAdminSecret(): Promise<void>;
  /**
   * If successfully called, new ADMIN User will be added to the
   * database. Have in mind that this method can only be called if
   * no ADMIN Users exist in the database.
   */
  createAdmin(data: {
    code: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<void>;
  /**
   * Delete specified User. Have in mind that only ADMIN User can
   * call this method successfully.
   */
  delete(id: string): Promise<void>;
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
}

export function UserHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
  storage: Storage,
  clearData: () => void,
  accessToken: JWT,
  isLoggedIn: () => Promise<boolean>,
): UserHandlerPrototype {
  const queueable = Queueable<User | User[]>('getAll', 'get');
  let userCountLatch = false;

  return {
    async getAll() {
      return (await queueable.exec(
        'getAll',
        'first_done_free_all',
        async () => {
          const users = cacheControl.user.getAll();
          if (userCountLatch === false) {
            userCountLatch = true;
            const countResult: {
              count: number;
            } = await send({
              url: '/user/count',
              method: 'GET',
              headers: {
                Authorization: '',
              },
            });
            if (countResult.count === users.length) {
              return users;
            }
          } else {
            if (users.length > 0) {
              return users;
            }
          }
          const result: {
            users: User[];
          } = await send({
            url: '/user/all',
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          result.users.forEach((user) => {
            cacheControl.user.set(user);
          });
          return result.users;
        },
      )) as User[];
    },
    async get(id?) {
      return (await queueable.exec('get', 'free_one_by_one', async () => {
        if ((await isLoggedIn()) === false) {
          return undefined;
        }
        const user = cacheControl.user.get(
          id ? id : accessToken.payload.userId,
        );
        if (user) {
          return user;
        }
        const result: {
          user: User;
        } = await send({
          url: `/user${id ? '/' + id : ''}`,
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        cacheControl.user.set(result.user);
        return result.user;
      })) as User;
    },
    async update(data) {
      const result: {
        user: User;
      } = await send({
        url: '/user',
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.user.set(result.user);
      return result.user;
    },
    async add(data) {
      const result: {
        user: User;
      } = await send({
        url: '/user',
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.user.set(result.user);
      return result.user;
    },
    async makeAnAdmin(id) {
      const result: {
        user: User;
      } = await send({
        url: `/user/${id}/make-an-admin`,
        method: 'POST',
        headers: {
          Authorization: '',
        },
      });
      cacheControl.user.set(result.user);
      return result.user;
    },
    async generateAdminSecret() {
      await send({
        url: `/user/admin/secret`,
        method: 'POST',
      });
    },
    async createAdmin(data) {
      const result: {
        accessToken: string;
        refreshToken: string;
      } = await send({
        url: '/user/admin/create',
        method: 'POST',
        data,
      });
      await storage.set('at', result.accessToken);
      await storage.set('rt', result.refreshToken);
    },
    async delete(id) {
      await send({
        url: `/user/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      cacheControl.user.remove(id);
    },
    async login(email, password) {
      const result: {
        accessToken: string;
        refreshToken: string;
      } = await send(
        {
          url: '/auth/login',
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              email + ':' + password,
            ).toString('base64')}`,
          },
        },
        true,
      );
      await storage.set('at', result.accessToken);
      await storage.set('rt', result.refreshToken);
    },
    async logout() {
      const refreshToken = storage.get('rt');
      if (refreshToken) {
        await send(
          {
            url: '/auth/logout',
            method: 'POST',
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
          true,
        );
      }
      clearData();
    },
  };
}
