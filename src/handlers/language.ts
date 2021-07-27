import {
  BCMSLanguage,
  BCMSLanguageAddData,
  BCMSLanguageHandler,
  BCMSLanguageHandlerConfig,
  BCMSLanguageUpdateData,
  BCMSStoreMutationTypes,
} from '../types';
import { createBcmsDefaultHandler } from './_defaults';

export function createBcmsLanguageHandler({
  send,
  store,
}: BCMSLanguageHandlerConfig): BCMSLanguageHandler {
  return createBcmsDefaultHandler<
    BCMSLanguage,
    BCMSLanguageAddData,
    BCMSLanguageUpdateData
  >({
    baseUri: '/language',
    send,
    cache: {
      find(query) {
        return store.getters.language_find(query);
      },
      findAll() {
        return store.getters.language_items;
      },
      findOne(query) {
        return store.getters.language_findOne(query);
      },
      remove(item) {
        store.commit(BCMSStoreMutationTypes.language_remove, item);
      },
      set(item) {
        store.commit(BCMSStoreMutationTypes.language_set, item);
      },
    },
  });
}
