export type Msp = {
  address: string;
  company_name: string;
  id: number | null;
  is_mobile: number | boolean | null;
  name: string;
  okrug_name: string;
  productivity: number | null;
  shape: object;
  shortname: string;
};

export type CreateMsp = any;

export type UpdateMsp = any;

export type GetMsp = () => Promise<any>;
