import type {
  BCMSBackupHandler,
  BCMSMediaHandler,
  SendFunction,
} from '../types';
import * as FormData from 'form-data';

export function createBcmsBackupHandler({
  send,
  mediaHandler,
}: {
  send: SendFunction;
  mediaHandler: BCMSMediaHandler;
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
    async restoreEntities(data) {
      await send({
        url: `${baseUri}/restore-entities`,
        method: 'POST',
        headers: {
          Authorization: '',
        },
        data,
      });
    },
    async restoreMediaFile(data) {
      const formData = new FormData();
      formData.append('media', data.file, data.name);
      const uploadToken = await mediaHandler.requestUploadToken();
      await send({
        url: `${baseUri}/restore-media-file/${data.id}`,
        method: 'POST',
        headers: {
          'X-Bcms-Upload-Token': uploadToken,
          'Content-Type': `multipart/form-data${
            typeof formData.getBoundary !== 'undefined'
              ? `; boundary=${formData.getBoundary()}`
              : ''
          }`,
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
