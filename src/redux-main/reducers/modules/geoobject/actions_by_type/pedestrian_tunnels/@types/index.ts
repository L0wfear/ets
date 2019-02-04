export type PedestrianTunnels = {
  adm_area: string;
  company_name?: string;
  created_at: string | null;
  district: string;
  geo_data_json: object;
  geo_data_msk_json: object;
  global_id: number | null;
  id: number | null;
  location: string;
  name: string;
  number: number | null;
  shape: object;
  updated_at: string | null;
};

export type CreatePedestrianTunnels = any;

export type UpdatePedestrianTunnels = any;

export type GetPedestrianTunnels = () => Promise<any>;
