import {
  BCMSTemplate,
  BCMSTemplateCreateData,
  BCMSTemplateHandler,
  BCMSTemplateHandlerConfig,
  BCMSTemplateUpdateData,
  BCMSStoreMutationTypes,
} from '../types';
import { createBcmsDefaultHandler } from './_defaults';

export function createBcmsTemplateHandler({
  send,
  store,
}: BCMSTemplateHandlerConfig): BCMSTemplateHandler {
  const baseUri = '/template';
  return createBcmsDefaultHandler<
    BCMSTemplate,
    BCMSTemplateCreateData,
    BCMSTemplateUpdateData
  >({
    baseUri,
    send,
    cache: {
      find(query) {
        return store.getters.template_find(query);
      },
      findAll() {
        return store.getters.template_items;
      },
      findOne(query) {
        return store.getters.template_findOne(query);
      },
      remove(item) {
        store.commit(BCMSStoreMutationTypes.template_remove, item);
      },
      set(item) {
        store.commit(BCMSStoreMutationTypes.template_set, item);
      },
    },
  });
}
