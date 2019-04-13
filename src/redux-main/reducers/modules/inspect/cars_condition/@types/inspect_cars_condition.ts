import { Company } from 'redux-main/reducers/modules/company/@types';
import { DefaultPartInspect } from '../../@types/inspect_reducer';

type AgentsFromGbu = {
  fio: string;
  position: string;
};

export type PreparingCarsCheck = {
  order_issued_at: string;
  order_number: string,
  master_plan_approved: string;
  named_plan_approved: string;
  planned_target: string;
  statements_defects_issued: string;
  statements_defects_not_issued_cnt: string;
  drawbacks_eliminated: string;
  drawbacks_new: string;
};

export type InspectCarsCondition = {
  agents_from_gbu: AgentsFromGbu[];
  fio: string;
  position: string;
  cars_cnt: number;
  checked_cars_cnt: number;
  checks_period: string;
  checks_period_text: string;
  checks_type: string;
  checks_type_text: string;
  close_employee_fio: string;
  close_employee_id: number;
  close_employee_position: string;
  commission_members: AgentsFromGbu[];
  company_id: number;
  company_name: string;
  date_start: string;
  id: number;
  inspection_company_id: number;
  inspection_company_name: string;
  head_balance_holder_base: {
    fio: string;
    tel: string;
  };
  head_operating_base: {
    fio: string;
    tel: string;
  };
  headcount_list: {       // Штатная и списочная численность
    staff_drivers: number;
    staff_mechanics: number;
    list_drivers: number;
    list_mechanics: number;
    staffing_drivers: number;
    staffing_mechanics: number;
    cars_use: {
      waybill_issue_log_exists: string;
      waybill_issue_log_used: string;
      comment: string;
      comment_detected: string
    },
  },
  monitoring_kind: string;
  monitoring_kind_text: string;
  open_employee_fio: string;
  open_employee_id: number;
  preparing_cars_check: PreparingCarsCheck;
  resolve_to: string;
  status_text: string;
  type: 'cars_condition';
  data?: any;
  files: any[];
} & DefaultPartInspect;

export type IStateInspectCarsCondition = {
  companyList: Company[],
  inspectCarsConditionList: InspectCarsCondition[];
  lastConductingInspect: InspectCarsCondition;
  lastCompletedInspect: InspectCarsCondition;
};

export type CarsConditionCars = {
  fact_status: string;
  fact_status_text: string;
  gov_number: string;
  id: number;
  marka: string;
  model: string;
  type: string;
  was_resaved: boolean;
};
