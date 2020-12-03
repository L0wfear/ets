export type Tachograph = {
  id: number;
  tachograph_id: number;
  company_id: number;
  company_structure_id: number;
  company_structure_name: string;
  tachograph_brand_id: number;
  tachograph_brand_name: string;
  factory_number: string;
  gov_number: string;
  okrug_name: string;
  company_name: string;
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
