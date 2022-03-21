export interface BCMSBackupHandler {
  create(data: { media?: boolean }): Promise<string>;
  restore(data: { file: File | Buffer }): Promise<void>;
  delete(data: { hash: string }): Promise<void>;
}
