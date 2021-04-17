import type { BCMSMedia, BCMSMediaAggregate } from '../models';

export interface BCMSSdkMediaRequestHandlerPrototype {
  getAll(): Promise<BCMSMedia[]>;
  getAllByParentId(parentId: string, propagate?: boolean): Promise<BCMSMedia[]>;
  getAllAggregated(): Promise<BCMSMediaAggregate[]>;
  getAllByParentIdAggregated(
    parentId: string,
  ): Promise<BCMSMediaAggregate[] | null>;
  getMany(ids: string[]): Promise<BCMSMedia[]>;
  get(id: string): Promise<BCMSMedia>;
  getAggregated(id: string): Promise<BCMSMediaAggregate>;
  getUrlWithAccessToken(media: BCMSMedia, size?: 'small'): Promise<string>;
  getBinary(id: string, size?: 'small'): Promise<Buffer>;
  count(): Promise<number>;
  /**
   * Add new file to the server and the database. If parent ID
   * is not provided, file will be added to the root.
   */
  addFile(
    formData: FormData & {
      getBoundary?(): number;
    },
    parentId?: string,
    uploadProgressCallback?: (data: unknown) => void,
  ): Promise<BCMSMedia>;
  /**
   * Create a new DIR Media on the server and in database.
   */
  addDir(data: { name: string; parentId?: string }): Promise<BCMSMedia>;
  update(data: { _id: string; rename: string }): Promise<BCMSMedia>;
  /**
   * Will remove specified Media and its dependencies from
   * the database. Have in mind that deleting a DIR, all
   * of its children will be deleted to.
   */
  deleteById(id: string): Promise<void>;
}
