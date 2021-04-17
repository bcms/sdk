import type {
  BCMSGroup,
  BCMSSdkCacheControllerPrototype,
  BCMSSdkDefaultRequestHandlerConfig,
  BCMSSdkGroupRequestHandlerAddData,
  BCMSSdkGroupRequestHandlerPrototype,
  BCMSSdkGroupRequestHandlerUpdateData,
  BCMSSdkRequestHandlerManagerPrototype,
  BCMSSdkSendFunction,
  BCMSTemplate,
  BCMSWidget,
} from '../types';
import { BCMSSdkDefaultRequestHandler } from './default';

export function BCMSSdkGroupRequestHandler(
  config: BCMSSdkDefaultRequestHandlerConfig,
  cache: BCMSSdkCacheControllerPrototype,
  rhManager: BCMSSdkRequestHandlerManagerPrototype,
  send: BCMSSdkSendFunction,
) {
  const defHandler = BCMSSdkDefaultRequestHandler<
    BCMSGroup,
    BCMSSdkGroupRequestHandlerAddData,
    BCMSSdkGroupRequestHandlerUpdateData
  >(config, cache.group, send);
  const self: BCMSSdkGroupRequestHandlerPrototype = {
    ...defHandler,
    async whereIsItUsed(id) {
      const result: {
        templateIds: string[];
        groupIds: string[];
        widgetIds: string[];
      } = await send({
        url: `${config.baseUri}/${id}/where-is-it-used`,
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      const output: {
        templates: BCMSTemplate[];
        groups: BCMSGroup[];
        widgets: BCMSWidget[];
      } = {
        groups: [],
        templates: [],
        widgets: [],
      };
      // TODO: Get many templates
      // TODO: Get many widgets
      output.groups = await self.getMany(result.groupIds);
      return output;
    },
  };
  return self;
}
