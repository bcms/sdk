import type {
  BCMSSdkSendFunction,
  BCMSSdkShimRequestHandlerPrototype,
  BCMSSdkStoragePrototype,
} from '../types';

export function BCMSSdkShimRequestHandler(
  send: BCMSSdkSendFunction,
  storage: BCMSSdkStoragePrototype,
) {
  const baseUri = '/shim';
  const self: BCMSSdkShimRequestHandlerPrototype = {
    verify: {
      async otp(otp) {
        const query: {
          accessToken: string;
          refreshToken: string;
        } = await send({
          url: `${baseUri}/user/verify/otp`,
          method: 'POST',
          data: {
            otp,
          },
        });
        await storage.set('at', query.accessToken);
        await storage.set('rt', query.refreshToken);
      },
    },
  };
  return self;
}
