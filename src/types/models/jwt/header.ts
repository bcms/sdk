// eslint-disable-next-line no-shadow
export enum BCMSJWTEncryptionAlg {
  HMACSHA256 = 'HS256',
  HMACSHA512 = 'HS512',
}

export interface BCMSJWTHeader {
  type: string;
  alg: BCMSJWTEncryptionAlg;
}
