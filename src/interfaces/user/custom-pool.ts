import { UserAddress } from './address';
import { UserPersonal } from './personal';
import { UserPolicy } from './policy';

export interface UserCustomPool {
  personal: UserPersonal;
  address: UserAddress;
  policy: UserPolicy;
}
