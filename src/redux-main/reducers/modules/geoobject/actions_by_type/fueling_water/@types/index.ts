export type FuelingWater = {
  address: string;
  company_name: string;
  id: number;
  name: string;
  shape: object;
};

export type CreateFuelingWater = any;

export type UpdateFuelingWater = any;

export type GetFuelingWater = () => Promise<any>;
