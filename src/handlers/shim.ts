import type { BCMSShimHandler, BCMSShimHandlerConfig } from '../types';

export function createBcmsShimHandler({
  send,
  storage,
}: BCMSShimHandlerConfig): BCMSShimHandler {
  const baseUri = '/shim';
  return {
    verify: {
      async otp(otp) {
        const result: {
          accessToken: string;
          refreshToken: string;
        } = await send({
          url: `${baseUri}/user/verify/otp`,
          method: 'POST',
          data: {
            otp,
          },
        });
        await storage.set('rt', result.refreshToken);
        await storage.set('at', result.accessToken);
      },
    },
  };
}
