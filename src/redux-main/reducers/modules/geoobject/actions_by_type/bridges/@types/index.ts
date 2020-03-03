export type Bridges = {
  created_at: string | null;
  company_name?: string;
  crossing: string;
  district: Array<string>;
  district_text: string;
  geo_data_json: object;
  geo_data_msk_json: object;
  global_id: number | null;
  id: number | null;
  location: string;
  name: string;
  number: number | null;
  shape: object;
  updated_at: string | null;
  year_of_commissioning: number | null;
};
