export interface UserPolicyCRUD {
  get: boolean;
  post: boolean;
  put: boolean;
  delete: boolean;
}

export interface UserPolicy {
  media: UserPolicyCRUD;
  customPortal: UserPolicyCRUD;
  entries: Array<{ _id: string } & UserPolicyCRUD>;
  webhooks: Array<{ _id: string } & UserPolicyCRUD>;
}
