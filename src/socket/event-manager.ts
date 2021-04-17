import type {
  BCMSJwt,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkRequestHandlerManagerPrototype,
  BCMSSdkSocketEventData,
  BCMSSdkSocketEventHandlerPrototype,
  BCMSSdkSocketSubscriptions,
} from '../types';
import { BCMSRoleName, BCMSSdkSocketEventName } from '../types';

export function BCMSSdkSocketEventHandler(
  cache: BCMSSdkCacheControllerPrototype,
  rhManager: BCMSSdkRequestHandlerManagerPrototype,
  getSubs: () => BCMSSdkSocketSubscriptions,
  getAccessToken: () => BCMSJwt | null,
  getSocketId: () => string | null,
) {
  function callSubs(
    eventName: BCMSSdkSocketEventName,
    data: BCMSSdkSocketEventData<unknown>,
  ) {
    const subs = getSubs();
    Object.keys(subs[BCMSSdkSocketEventName.API_KEY]).map((subId) => {
      subs[BCMSSdkSocketEventName.API_KEY][subId](data).catch((error) => {
        console.error(
          `Error occurred in socket subscription callback for [apiKey][${subId}]`,
        );
        console.error(error);
      });
    });
  }
  const self: BCMSSdkSocketEventHandlerPrototype = {
    async [BCMSSdkSocketEventName.API_KEY](data) {
      const at = getAccessToken();
      if (at && at.payload.roles[0].name === BCMSRoleName.ADMIN) {
        if (data.source === getSocketId()) {
          return;
        }
        const cacheItem = cache.apiKey.get(data.entry._id);
        if (cacheItem) {
          cache.apiKey.remove(data.entry._id);
          if (data.type !== 'remove') {
            await rhManager.apiKey.get(data.entry._id);
          }
          callSubs(BCMSSdkSocketEventName.API_KEY, data);
        }
      }
    },
  };
  return self;
}
