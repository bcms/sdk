import { AxiosRequestConfig } from 'axios';
import { APIFunction } from '../interfaces';
import { CacheControlPrototype } from '../cache';
import { Queueable } from '../util';

export interface FunctionHandlerPrototype {
  getAll(): Promise<APIFunction[]>;
}

export function FunctionHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
): FunctionHandlerPrototype {
  const queueable = Queueable<APIFunction[]>('getAll');

  return {
    async getAll() {
      return (await queueable.exec(
        'getAll',
        'first_done_free_all',
        async () => {
          const fns = cacheControl.apiFunction.getAll();
          if (fns.length > 0) {
            return fns;
          }
          const result: {
            functions: Array<{
              name: string;
              public: boolean;
            }>;
          } = await send({
            url: '/function/available',
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          result.functions.forEach((fn) => {
            cacheControl.apiFunction.set({
              _id: fn.name,
              public: fn.public,
            });
          });
          return result.functions.map((fn) => {
            return {
              _id: fn.name,
              public: fn.public,
            };
          });
        },
      )) as APIFunction[];
    },
  };
}
