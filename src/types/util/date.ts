export interface BCMSDateUtility {
  prettyElapsedTimeSince(millis: number): string;
  toReadable(millis: number): string;
}
