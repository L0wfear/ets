export type Company = {
  company_id: number | null;
  company_name: string;
  has_remote_checkup: boolean;
  fuel_cards_creating: boolean;
  id: number | null;
  okrug_name: string;
  okrug_id: number;
  rgb_color: string;
  short_name: string;
  use_pouring: boolean;
};

export type IStateCompany = {
  companyList: Array<Company>;
};
