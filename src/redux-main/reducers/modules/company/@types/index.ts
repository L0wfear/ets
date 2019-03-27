export type Company = {
  company_id: number | null;
  company_name: string;
  has_remote_checkup: boolean;
  id: number | null;
  okrug_name: string;
  okrug_id: number;
  rgb_color: string;
  short_name: string;
};

export type IStateCompany = {
  companyList: Company[];
};
