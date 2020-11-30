export type TachographMetrologicalVerification = {
  id: number;
  comment: string;
  factory_number: string;
  files: Array<any>;
  gov_number: string;
  tachograph_brand_name: string;
  tachograph_id: number;
  verification_date: string;
  verification_number: string;
  tachograph_brand_id: number;
};

export type TachographMetrologicalVerificationList = {
  comment: string;
  company_id: number;
  company_name: string;
  company_structure_id: number;
  company_structure_name: string;
  factory_number: string;
  files: Array<any>;
  gov_number: string;
  id: number;
  okrug_name: string;
  replacement_date: string;
  tachograph_brand_name: string;
  verification_date: string;
  verification_number: string;
};
