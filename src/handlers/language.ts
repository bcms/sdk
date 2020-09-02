import { Language } from '../interfaces';
import { Queueable } from '../util';
import { CacheControlPrototype } from '../cache';
import { AxiosRequestConfig } from 'axios';

export interface LanguageHandlerPrototype {
  getAll(): Promise<Language[]>;
  get(id: string): Promise<Language>;
  count(): Promise<number>;
  add(data: {
    code: string;
    name: string;
    nativeName: string;
  }): Promise<Language>;
  update(data: { _id: string; def?: boolean }): Promise<Language>;
  deleteById(id: string): Promise<void>;
}

export function LanguageHandler(
  cacheControl: CacheControlPrototype,
  send: <T>(conf: AxiosRequestConfig, doNotInjectAuth?: boolean) => Promise<T>,
): LanguageHandlerPrototype {
  const queueable = Queueable<Language | Language[]>('getAll', 'get');
  let countLatch = false;

  return {
    async getAll() {
      return (await queueable.exec(
        'getAll',
        'first_done_free_all',
        async () => {
          const languages = cacheControl.language.getAll();
          if (countLatch === false) {
            countLatch = true;
            const count = await this.count();
            if (count === languages.length) {
              return languages;
            }
          } else if (languages.length > 0) {
            return languages;
          }
          const result: {
            languages: Language[];
          } = await send({
            url: '/language/all',
            method: 'GET',
            headers: {
              Authorization: '',
            },
          });
          result.languages.forEach((language) => {
            cacheControl.language.set(language);
          });
          return result.languages;
        },
      )) as Language[];
    },
    async get(id) {
      return (await queueable.exec('get', 'free_one_by_one', async () => {
        const language = cacheControl.language.get(id);
        if (language) {
          return language;
        }
        const result: {
          language: Language;
        } = await send({
          url: `/language/${id}`,
          method: 'GET',
          headers: {
            Authorization: '',
          },
        });
        cacheControl.language.set(result.language);
        return result.language;
      })) as Language;
    },
    async count() {
      const result: {
        count: number;
      } = await send({
        url: '/language/count',
        method: 'GET',
        headers: {
          Authorization: '',
        },
      });
      return result.count;
    },
    async add(data) {
      const result: {
        language: Language;
      } = await send({
        url: '/language',
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.language.set(result.language);
      return result.language;
    },
    async update(data) {
      const result: {
        language: Language;
      } = await send({
        url: '/language',
        method: 'PUT',
        headers: {
          Authorization: '',
        },
        data,
      });
      cacheControl.language.set(result.language);
      return result.language;
    },
    async deleteById(id) {
      await send({
        url: `/language/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
      });
      await cacheControl.language.remove(id);
    },
  };
}
