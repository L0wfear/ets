export type TypeCompaniesIndex = {
  [key: string]: {
    company_id: number;
    company_name: string;
    has_remote_checkup: boolean | void;
    okrug_name: string | void;
    rgb_color: string;
    short_name: string;
  };
};
