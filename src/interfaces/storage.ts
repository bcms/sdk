export interface Storage {
  get: (key: string) => any | undefined;
  set: (key: string, value: any) => Promise<boolean>;
  remove: (key: string) => boolean;
  subscribe?: (
    key: string,
    handler: (value: any) => void | Promise<void>,
  ) => () => void;
}
