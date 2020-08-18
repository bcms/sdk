import { CacheControlPrototype } from '../control';
import { AxiosRequestConfig } from 'axios';
import { Queueable } from '../../util';
import { Group } from '../../interfaces';

export interface GroupHandlerPrototype {}

export function GroupHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
): GroupHandlerPrototype {
  const queueable = Queueable<Group | Group[]>();
}
