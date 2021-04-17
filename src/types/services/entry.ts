import type { BCMSEntry, BCMSEntryLite } from '../models';

export interface BCMSSdkEntryServicePrototype {
  toLite(entry: BCMSEntry): BCMSEntryLite;
}
