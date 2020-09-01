/**
 * Set of allowed values for request method.
 */
export enum ApiKeyMethod {
  GET_ALL = 'GET_ALL',
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  DELETE = 'DELETE',
}

/**
 * Defines what specific Key can do with Template/Templates.
 */
export interface ApiKeyAccess {
  /** Refers to all Templates */
  global: {
    methods: ApiKeyMethod[];
  };
  templates: Array<{
    /** Specific Template ID. */
    _id: string;
    /** Methods that can be executed on specified Template. */
    methods: ApiKeyMethod[];
    /** Entry level access definition for specified Template. */
    entry: {
      methods: ApiKeyMethod[];
    };
  }>;
  functions: Array<{
    name: string;
  }>;
}

export interface ApiKey {
  _id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  name: string;
  desc: string;
  blocked: boolean;
  secret: string;
  access: ApiKeyAccess;
}
