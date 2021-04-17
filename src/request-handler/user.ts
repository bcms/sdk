import type {
  BCMSJwt,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkSendFunction,
  BCMSSdkUserRequestHandlerPrototype,
  BCMSUser,
} from '../types';

export function BCMSSdkUserRequestHandler(
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
  getAccessToken: () => BCMSJwt | null,
) {
  const baseUri = '/user';
  const self: BCMSSdkUserRequestHandlerPrototype = {
    async get(id) {
      const accessToken = getAccessToken();
      if (!accessToken) {
        return null;
      }
      const user = cache.user.get(id ? id : accessToken.payload.userId);
      if (user) {
        return user;
      }
      const query: {
        item: BCMSUser;
      } = await send({
        url: `${baseUri}${id ? '/' + id : ''}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      cache.user.set(query.item);
      return query.item;
    },
  };
  return self;
}
