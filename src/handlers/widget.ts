import {
  BCMSWidget,
  BCMSWidgetCreateData,
  BCMSWidgetHandler,
  BCMSWidgetHandlerConfig,
  BCMSWidgetUpdateData,
  BCMSStoreMutationTypes,
  BCMSWidgetWhereIsItUsedResponse,
} from '../types';
import { createBcmsDefaultHandler } from './_defaults';

export function createBcmsWidgetHandler({
  send,
  store,
}: BCMSWidgetHandlerConfig): BCMSWidgetHandler {
  const baseUri = '/widget';
  const defaultHandler = createBcmsDefaultHandler<
    BCMSWidget,
    BCMSWidgetCreateData,
    BCMSWidgetUpdateData
  >({
    baseUri,
    send,
    cache: {
      find(query) {
        return store.getters.widget_find(query);
      },
      findAll() {
        return store.getters.widget_items;
      },
      findOne(query) {
        return store.getters.widget_findOne(query);
      },
      remove(item) {
        store.commit(BCMSStoreMutationTypes.widget_remove, item);
      },
      set(item) {
        store.commit(BCMSStoreMutationTypes.widget_set, item);
      },
    },
  });

  return {
    ...defaultHandler,
    async whereIsItUsed(id) {
      const result: BCMSWidgetWhereIsItUsedResponse = await send({
        url: `${baseUri}/${id}/where-is-it-used`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return result;
    },
  };
}
