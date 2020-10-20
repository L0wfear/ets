export type Tachograph = {
  id: number;
  tachograph_id: number;
  company_id: number;
  company_structure_id: number;
  company_structure_name: string;
  tachograph_brand_name: string;
  factory_number: string;
  gov_number: string;
  verification_number: string;
  calibration_date: string | Date;
  next_calibration_date: string | Date;
  calibration_type: string;
  verification_reason_name: string;
  verification_reason_id: number;
  other_reason: string;
  comment: string;
  calibration_type_name: string;
  files: Array<any>;
  dataForValidation: {
    installed_at: string | Date;
  }; // сторонние данные чтобы валдидировать через схему 
};
 
export type TachographListElement = {
  id: number;
  okrug_id: number;
  okrug_name: string;
  company_id: number;
  company_name: string;
  company_structure_id: number;
  company_structure_name: string;
  tachograph_brand_name: string;
  install_company_name: string;
  factory_number: string;
  installed_at: Date | string;
  uninstalled_at: null;
  activated_at: Date | string;
  gov_number: string;
  comment: string;
  calibration_date: Date | string;
  next_calibration_date: Date | string;
  repair_date: Date | string;
  verification_date: Date | string;
  reading_fact_date: Date | string;
  reading_plan_date: Date | string;
  replacement_date: Date | string;
  next_replacement_date: Date | string;
  plan_replacement: Date | string;
  verification_date_validity: Date | string;
  tachograph_on_car: Array<{
    id: number;
    car_id: number;
    gov_number: string;
    company_id: number;
    install_company_name: string;
    installed_at: Date | string;
    uninstalled_at: Date | string;
    activated_at: Date | string;
    rn: number;
  }>;
};