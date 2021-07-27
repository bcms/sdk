import {
  BCMSStatus,
  BCMSStatusCreateData,
  BCMSStatusHandler,
  BCMSStatusHandlerConfig,
  BCMSStatusUpdateData,
  BCMSStoreMutationTypes,
} from '../types';
import { createBcmsDefaultHandler } from './_defaults';

export function createBcmsStatusHandler({
  send,
  store,
}: BCMSStatusHandlerConfig): BCMSStatusHandler {
  return createBcmsDefaultHandler<
    BCMSStatus,
    BCMSStatusCreateData,
    BCMSStatusUpdateData
  >({
    baseUri: '/status',
    send,
    cache: {
      find(query) {
        return store.getters.status_find(query);
      },
      findAll() {
        return store.getters.status_items;
      },
      findOne(query) {
        return store.getters.status_findOne(query);
      },
      remove(item) {
        store.commit(BCMSStoreMutationTypes.status_remove, item);
      },
      set(item) {
        store.commit(BCMSStoreMutationTypes.status_set, item);
      },
    },
  });
}
