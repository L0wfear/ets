export type SnowStorage = {
  address: string;
  company_name: string;
  id: number;
  name: string;
  shape: object;
};

export type CreateSnowStorage = any;

export type UpdateSnowStorage = any;

export type GetSnowStorage = () => Promise<any>;
