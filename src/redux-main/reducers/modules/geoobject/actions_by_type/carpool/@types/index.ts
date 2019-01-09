export type Carpool = {
  address: string;
  company_name: string;
  contractor_id: number | null;
  id: number | null;
  is_main: false
  name: string;
  shape: object;
};

export type createCarpool = any;

export type updateCarpool = any;

export type getCarpool = () => Promise<any>;
