export type PgmStore = {
  address: string;
  company_name: string;
  company_id: number | null;
  id: number | null;
  liquid_pgm_volume: number | null
  name: string;
  pgm_stores_type_name: string;
  shape: object;
  solid_pgm_volume: number | null;
};

export type CreatePgmStore = any;

export type UpdatePgmStore = any;

export type GetPgmStore = () => Promise<any>;
