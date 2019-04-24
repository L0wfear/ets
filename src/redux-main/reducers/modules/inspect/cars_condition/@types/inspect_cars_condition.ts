import { Company } from 'redux-main/reducers/modules/company/@types';
import { DefaultPartInspect } from '../../@types/inspect_reducer';

type AgentsFromGbu = {
  fio: string;
  position: string;
};

type CommissionMembers = {
  fio: string;
  position: string;
  employee_id: number;
  assignment: string;
  assignment_date_start: string;
};

export type HeadcountList = {       // Штатная и списочная численность
  staff_drivers: number;
  staff_mechanics: number;
  list_drivers: number;
  list_mechanics: number;
  staffing_drivers: number;
  staffing_mechanics: number;
};

export type CarsUse = {
  waybill_issue_log_exists: string;
  waybill_issue_log_used: string;
  comment: string;
  comment_detected: string
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

export type TypesСar = {
  allseason_use_cnt: string;
  checks_period_use_cnt: string;
  type: string;
  will_checked_cnt: string;
};
export type TypesHarvestingUnit = {
  not_ready_cnt: string;
  ready_cnt: string;
  season: string;
  type: string;
  will_checked_cnt: string;
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
  close_employee_assignment: string;
  close_employee_assignment_date_start: string;
  close_employee_fio: string;
  close_employee_id: number;
  close_employee_position: string;
  commission_members: CommissionMembers[];
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
  monitoring_kind: string;
  monitoring_kind_text: string;
  open_employee_fio: string;
  open_employee_id: number;
  resolve_to: string;
  status_text: string;
  type: 'cars_condition';
  data?: {
    types_cars: TypesСar[],
    types_harvesting_unit: TypesHarvestingUnit[],
    preparing_cars_check: PreparingCarsCheck;
    headcount_list: HeadcountList,
    cars_use: CarsUse,
  };
  files: any[];
} & DefaultPartInspect;

export type IStateInspectCarsCondition = {
  companyList: Company[],
  inspectCarsConditionList: InspectCarsCondition[];
  lastConductingInspect: InspectCarsCondition;
  lastCompletedInspect: InspectCarsCondition;
};

export type CarsConditionCars = {
  inspection_id?: number;
  status: string;
  fact_status: string;
  fact_status_text: string;
  gov_number: string;
  id: number;
  marka: string;
  model: string;
  type: string;
  was_resaved: boolean;
  state_exploitation: string;
  vin: string;
  mileage: number;
  osago: string;
  osago_finished_at: string;
  diagnostic_card: string;
  diagnostic_card_finished_at: string;
  last_tech_inspection_date: string;
  updated_at: string;
  season: string;
  data: {
    no_status_docs: boolean;
    fact_mileage: number;
    defects_body: boolean;
    defects_chassis: boolean;
    defects_attachments: boolean;
    incomplete_equipment: boolean;
    liquids_leak: boolean;
    no_glonass: boolean;
    logos_not_required: boolean;
    no_logos: boolean;

    does_not_start: boolean;
    broken_chassis: boolean;
    broken_attachments: boolean;
    broken_lighting: boolean;
    broken_lighting_alarm: boolean;
    broken_audible_alarm: boolean;
    broken_windscreen_wipers: boolean;
    broken_windscreen_washers: boolean;

    no_registration: boolean;
    owner_not_match: boolean;
    no_vin: boolean;
    registration_not_match_vin: boolean;
    no_valid_diagnostic_card: boolean;
    osago_not_required: boolean;
    no_valid_osago: boolean;
    act_readiness_not_issued: boolean;

    untimely_maintenance: boolean;
    technical_inspection_not_passed: boolean;
    not_ready_to_work: boolean;
    comments: string;

    waybill_number?: number;
    mission_numbers?: number;
    not_passed_verification_glonass?: boolean;
    reason_repair?: string;
  };
  files: any[];
};
