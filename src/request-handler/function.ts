import type {
  BCMSApiFunction,
  BCMSSdkApiFunctionRequestHandlerPrototype,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkSendFunction,
} from '../types';

export function BCMSSdkApiFunctionRequestHandler(
  cache: BCMSSdkCacheControllerPrototype,
  send: BCMSSdkSendFunction,
) {
  let getAllLatch = false;
  const self: BCMSSdkApiFunctionRequestHandlerPrototype = {
    async getAll() {
      if (getAllLatch) {
        return cache.apiFunction.getAll();
      }
      const query: { items: BCMSApiFunction[] } = await send({
        url: '/function/all',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      getAllLatch = true;
      query.items.forEach((e) => {
        cache.apiFunction.set(e);
      });
      return query.items;
    },
  };
  return self;
}
