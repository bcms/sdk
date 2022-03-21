import type { BCMSBackupHandler, SendFunction } from '../types';
import * as FormData from 'form-data';

export function createBcmsBackupHandler({
  send,
}: {
  send: SendFunction;
}): BCMSBackupHandler {
  const baseUri = '/backup';

  return {
    async create(data) {
      const res = await send<{
        hash: string;
      }>({
        url: `${baseUri}/create`,
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
      return res.hash;
    },
    async restore(data) {
      const formData = new FormData();
      formData.append('media', data.file, '_backup.zip');
      await send({
        url: `${baseUri}/restore`,
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data: formData,
      });
    },
    async delete(data) {
      await send({
        url: `${baseUri}/delete`,
        method: 'DELETE',
        headers: {
          Authorization: '',
        },
        data,
      });
    },
  };
}
