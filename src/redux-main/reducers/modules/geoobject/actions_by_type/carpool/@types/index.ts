export type Carpool = {
  address: string;
  company_name: string;
  contractor_id: number | null;
  id: number | null;
  is_main: boolean;
  name: string;
  shape: object;
};

export type CreateCarpool = any;

export type UpdateCarpool = any;

export type GetCarpool = () => Promise<any>;
