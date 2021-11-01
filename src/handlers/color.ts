import {
  BCMSColor,
  BCMSColorCreateData,
  BCMSColorUpdateData,
  BCMSStoreMutationTypes,
} from '../types';
import type {
  BCMSColorHandler,
  BCMSColorHandlerConfig,
} from '../types/handlers/color';
import { createBcmsDefaultHandler } from './_defaults';

export function createBcmsColorHandler({
  send,
  store,
}: BCMSColorHandlerConfig): BCMSColorHandler {
  const baseUri = '/color';
  return createBcmsDefaultHandler<
    BCMSColor,
    BCMSColorCreateData,
    BCMSColorUpdateData
  >({
    baseUri,
    send,
    cache: {
      find(query) {
        return store.getters.color_find(query);
      },
      findAll() {
        return store.getters.color_items;
      },
      findOne(query) {
        return store.getters.color_findOne(query);
      },
      remove(item) {
        store.commit(BCMSStoreMutationTypes.color_remove, item);
      },
      set(item) {
        store.commit(BCMSStoreMutationTypes.color_set, item);
      },
    },
  });
}
