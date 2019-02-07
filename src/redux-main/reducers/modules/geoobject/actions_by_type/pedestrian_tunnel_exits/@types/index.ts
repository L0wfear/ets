export type PedestrianTunnelExits = {
  adm_area: string;
  company_name?: string;
  created_at: string | null;
  district: string;
  geo_data_json: object;
  geo_data_msk_json: object;
  global_id: number | null;
  id: number | null;
  internal_id: string;
  name: string;
  number: number | null;
  shape: object;
  updated_at: string | null;
};

export type CreatePedestrianTunnelExits = any;

export type UpdatePedestrianTunnelExits = any;

export type GetPedestrianTunnelExits = () => Promise<any>;
