import {
  BCMSApiKey,
  BCMSApiKeyAddData,
  BCMSApiKeyHandler,
  BCMSApiKeyHandlerConfig,
  BCMSApiKeyUpdateData,
  BCMSStoreMutationTypes,
} from '../types';
import { createBcmsDefaultHandler } from './_defaults';

export function createBcmsApiKeyHandler({
  send,
  store,
}: BCMSApiKeyHandlerConfig): BCMSApiKeyHandler {
  return createBcmsDefaultHandler<
    BCMSApiKey,
    BCMSApiKeyAddData,
    BCMSApiKeyUpdateData
  >({
    baseUri: '/key',
    send,
    cache: {
      find(query) {
        return store.getters.apiKey_find(query);
      },
      findAll() {
        return store.getters.apiKey_items;
      },
      findOne(query) {
        return store.getters.apiKey_findOne(query);
      },
      remove(item) {
        store.commit(BCMSStoreMutationTypes.apiKey_remove, item);
      },
      set(item) {
        store.commit(BCMSStoreMutationTypes.apiKey_set, item);
      },
    },
  });
}
