export interface BCMSBackupHandler {
  create(data: { media?: boolean }): Promise<string>;
  delete(data: { hash: string }): Promise<void>;
  restoreEntities(data: {
    type:
      | 'apiKey'
      | 'entry'
      | 'group'
      | 'idc'
      | 'language'
      | 'media'
      | 'status'
      | 'template'
      | 'templateOrganizer'
      | 'user'
      | 'widget'
      | 'color'
      | 'tag'
      | 'change';
    items: unknown[];
  }): Promise<void>;
  restoreMediaFile(data: {
    file: File | Buffer;
    name: string;
    id: string;
  }): Promise<void>;
}
