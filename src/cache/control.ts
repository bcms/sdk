import { UserCacheHandler } from './handlers';
import { CacheHandlerPrototype } from './handler';
import { User } from '../interfaces';

export interface CacheControlPrototype {
  clear: () => void;
  user: CacheHandlerPrototype<User>;
}

export function CacheControl(): CacheControlPrototype {
  const TTL = 86400000;
  const user = UserCacheHandler(TTL);

  return {
    user,
    clear: () => {
      user.clear();
    },
  };
}
