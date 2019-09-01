export type FountainsWorkingHour = {
  Hours: string,
  DayOfWeek: string,
};

export type Fountains = {
  adm_area: string;
  balance_holder_email: string;
  balance_holder_name: string;
  balance_holder_phone: string;
  balance_holder_web_site: string;
  company_name?: string;
  created_at: string | null;
  departmental_affiliation: string;
  district: string;
  geo_data_json: object;
  geo_data_msk_json: object;
  global_id: number | null;
  id: number | null;
  location: string;
  name: string;
  number: number | null;
  operation_organization_email: string;
  operation_organization_name: string;
  operation_organization_phone: string;
  shape: object;
  updated_at: string | null;
  working_hours: FountainsWorkingHour[],
  working_hours_text: string;
};
