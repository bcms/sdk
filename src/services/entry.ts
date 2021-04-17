import type { BCMSSdkEntryServicePrototype } from '../types';

export function BCMSSdkEntryService() {
  const self: BCMSSdkEntryServicePrototype = {
    toLite(entry) {
      return {
        _id: entry._id,
        status: entry.status,
        createdAt: entry.createdAt,
        meta: entry.meta,
        templateId: entry.templateId,
        updatedAt: entry.updatedAt,
        userId: entry.userId,
      };
    },
  };
  return self;
}
