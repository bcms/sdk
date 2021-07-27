import {
  BCMSTemplateOrganizer,
  BCMSTemplateOrganizerCreateData,
  BCMSTemplateOrganizerHandler,
  BCMSTemplateOrganizerHandlerConfig,
  BCMSTemplateOrganizerUpdateData,
  BCMSStoreMutationTypes,
} from '../types';
import { createBcmsDefaultHandler } from './_defaults';

export function createBcmsTemplateOrganizerHandler({
  send,
  store,
}: BCMSTemplateOrganizerHandlerConfig): BCMSTemplateOrganizerHandler {
  const baseUri = '/template/organizer';
  return createBcmsDefaultHandler<
    BCMSTemplateOrganizer,
    BCMSTemplateOrganizerCreateData,
    BCMSTemplateOrganizerUpdateData
  >({
    baseUri,
    send,
    cache: {
      find(query) {
        return store.getters.templateOrganizer_find(query);
      },
      findAll() {
        return store.getters.templateOrganizer_items;
      },
      findOne(query) {
        return store.getters.templateOrganizer_findOne(query);
      },
      remove(item) {
        store.commit(BCMSStoreMutationTypes.templateOrganizer_remove, item);
      },
      set(item) {
        store.commit(BCMSStoreMutationTypes.templateOrganizer_set, item);
      },
    },
  });
}
