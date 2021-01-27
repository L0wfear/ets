export type TachographRepair = {
  comment: string;
  factory_number: string;
  gov_number: string;
  id: number;
  repair_date: string;
  repair_reason_id: number;
  repair_reason_name: string;
  tachograph_brand_name: string;
  tachograph_id: number;
  tachograph_brand_id: number;
};

export type TachographRepairList = {
  comment: string;
  company_id: number;
  company_name: string;
  company_structure_id: number;
  company_structure_name: string;
  factory_number: string;
  gov_number: string;
  id: number;
  okrug_name: string;
  repair_date: string;
  repair_reason_name: string;
  tachograph_brand_name: string;
};
