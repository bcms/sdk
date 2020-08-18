import { UserCustomPool } from './custom-pool';
import { Role } from '../jwt';

export interface User {
  _id: string;
  createdAt: number;
  updatedAt: number;
  username: string;
  email: string;
  roles: Role[];
  customPool: UserCustomPool;
}
