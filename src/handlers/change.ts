import type {
    BCMSChangeHandlerConfig,
    BCMSChangeHandler,
    GetInfoData,
  } from '../types';
  
  export function createBcmsChangeHandler({
    send,
  }: BCMSChangeHandlerConfig): BCMSChangeHandler {
    const baseUri = '/changes';
    return {
      async getInfo() {
        const result: { item: GetInfoData } = await send({
          url: `${baseUri}/info`,
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        return result.item;
      },
    };
  }