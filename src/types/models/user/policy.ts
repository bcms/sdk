export interface BCMSUserPolicyCRUD {
  get: boolean;
  post: boolean;
  put: boolean;
  delete: boolean;
}

export interface BCMSUserPolicy {
  media: BCMSUserPolicyCRUD;
  customPortal: BCMSUserPolicyCRUD;
  templates: Array<{ _id: string } & BCMSUserPolicyCRUD>;
  webhooks: Array<{ _id: string } & BCMSUserPolicyCRUD>;
  plugins: Array<{ name: string } & BCMSUserPolicyCRUD>;
}
