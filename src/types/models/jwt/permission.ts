// eslint-disable-next-line no-shadow
export enum BCMSPermissionName {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  EXECUTE = 'EXECUTE',
}

export interface BCMSPermission {
  name: BCMSPermissionName;
}
