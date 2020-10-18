import { TachographDataReadingList } from '../../tachograph_data_reading/@types';
import { TachographReplacementSkziList } from '../../tachograph_replacement_skzi/@types';

export type TachographOnCarList = {
  activated_at: string;
  car_id: number;
  company_id: number;
  gov_number: string;
  id: number;
  install_company_name: string;
  installed_at: string;
  rn: string;
  uninstalled_at: string;
};

export type TachographList = {
  activated_at: string;
  calibration_date: string;
  comment: string;
  company_id: number;
  company_name: string;
  company_structure_id: number;
  company_structure_name: string;
  factory_number: string;
  gov_number: string;
  id: number;
  installed_at: string;
  install_company_name: string;
  next_calibration_date: string;
  next_replacement_date: string;
  okrug_id: number;
  okrug_name: string;
  plan_replacement: string;
  reading_fact_date: string;
  reading_plan_date: string;
  repair_date: string;
  repair_reason_name: string;
  replacement_date: string;
  tachograph_brand_name: string;
  tachograph_on_car: Array<TachographOnCarList>;
  uninstalled_at: string;
  verification_date: string;
  verification_date_validity: string;
};

export type TachographListOuterProps = {
  tachograph_data_reading: Array<TachographDataReadingList>;
  tachograph_replacement_skzi: Array<TachographReplacementSkziList>;
};

export type TachographListDataForValidation = {
  current_date: string | Date;
};

export type TachographListWithOuterProps = TachographList & TachographListOuterProps & TachographListDataForValidation;
