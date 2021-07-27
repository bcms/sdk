import {
  BCMSStoreMutationTypes,
  BCMSUser,
  BCMSUserHandler,
  BCMSUserHandlerConfig,
} from '../types';

export function createBcmsUserHandler({
  send,
  getAccessToken,
  store,
}: BCMSUserHandlerConfig): BCMSUserHandler {
  const baseUri = '/user';
  return {
    async get(id, skipCache) {
      if (!skipCache) {
        const accessToken = getAccessToken();
        if (!accessToken) {
          throw Error('You must be logged in.');
        }
        const targetId = id ? id : accessToken.payload.userId;
        const cacheHit = store.getters.user_findOne((e) => e._id === targetId);
        if (cacheHit) {
          return cacheHit;
        }
      }
      const result: {
        item: BCMSUser;
      } = await send({
        url: `${baseUri}${id ? '/' + id : ''}`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      store.commit(BCMSStoreMutationTypes.user_set, result.item);
      return result.item;
    },
  };
}
