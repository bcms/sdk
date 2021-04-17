export interface BCMSSdkDefaultRequestHandlerConfig {
  baseUri: string;
}
export interface BCMSSdkDefaultRequestHandlerEntity {
  _id: string;
  createdAt: number;
  updatedAt: number;
}
export interface BCMSSdkDefaultRequestHandlerPrototype<
  Entity extends BCMSSdkDefaultRequestHandlerEntity,
  AddData,
  UpdateData
> {
  get(id: string): Promise<Entity>;
  getAll(): Promise<Entity[]>;
  getMany(ids: string[]): Promise<Entity[]>;
  create(data: AddData): Promise<Entity>;
  update(data: UpdateData): Promise<Entity>;
  deleteById(id: string): Promise<void>;
  count(): Promise<number>;
}
