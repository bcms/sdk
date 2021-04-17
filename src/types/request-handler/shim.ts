export interface BCMSSdkShimRequestHandlerPrototype {
  verify: {
    otp(otp: string): Promise<void>;
  };
}
