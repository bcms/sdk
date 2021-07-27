import {
  BCMSGroup,
  BCMSGroupAddData,
  BCMSGroupHandler,
  BCMSGroupHandlerConfig,
  BCMSGroupLite,
  BCMSGroupUpdateData,
  BCMSGroupWhereIsItUsedResponse,
  BCMSStoreMutationTypes,
} from '../types';
import { createBcmsDefaultHandler } from './_defaults';

export function createBcmsGroupHandler({
  send,
  store,
}: BCMSGroupHandlerConfig): BCMSGroupHandler {
  const baseUri = '/group';
  const defaultHandler = createBcmsDefaultHandler<
    BCMSGroup,
    BCMSGroupAddData,
    BCMSGroupUpdateData
  >({
    baseUri,
    send,
    cache: {
      find(query) {
        return store.getters.group_find(query);
      },
      findAll() {
        return store.getters.group_items;
      },
      findOne(query) {
        return store.getters.group_findOne(query);
      },
      remove(item) {
        store.commit(BCMSStoreMutationTypes.group_remove, item);
      },
      set(item) {
        store.commit(BCMSStoreMutationTypes.group_set, item);
      },
    },
  });

  let getAllLiteLatch = false;

  return {
    ...defaultHandler,
    async getAllLite() {
      if (getAllLiteLatch) {
        return store.getters.groupLite_items;
      }
      const result: {
        items: BCMSGroupLite[];
      } = await send({
        url: baseUri + '/all/lite',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      store.commit(BCMSStoreMutationTypes.groupLite_set, result.items);
      getAllLiteLatch = true;
      return result.items;
    },
    async whereIsItUsed(id) {
      const result: BCMSGroupWhereIsItUsedResponse = await send({
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
