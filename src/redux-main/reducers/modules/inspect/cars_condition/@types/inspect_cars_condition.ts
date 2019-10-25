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
  no_order: boolean;
  planned_target: string;
  statements_defects_issued: string;
  statements_defects_not_issued_cnt: string;
  drawbacks_eliminated: string;
  drawbacks_new: string;
};

export type TypesСar = {
  allseason_use_cnt: number;
  checks_period_use_cnt: number;
  type: string;
  will_checked_cnt: number;
};
export type TypesHarvestingUnit = {
  not_ready_cnt: number;
  ready_cnt: number;
  season: string;
  type: string;
  will_checked_cnt: number;
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
  company_short_name: string;
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
  monitoring_kind: string | null;
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
    headcount: HeadcountList,
    cars_use: CarsUse,
  };
  files: any[];
  action: string;
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
  car_id: number;
  marka: string;
  model: string;
  type: string;
  was_resaved: boolean;
  state_exploitation: string;
  vin: string;
  vin_incorrect: boolean;
  last_repair: string;
  factory_number_incorrect: boolean;
  vin_by_hand: string;
  last_repair_company: string;
  factory_number: string;
  factory_number_by_hand: string;
  manufactured_at: string;
  environmental_class: string;
  engine_type: string;
  origin_country: string;
  kind: string;
  registration_date: string;
  exploitation_date_start: string;
  kind_purchase: string;
  gby_district: string;
  gby_operation_district: string;
  last_tm_repair_company: string;
  max_weight: number;
  odometr_fact: number | null;
  motohours_fact: number | null;
  status_at_check: string;
  osago: string;
  osago_finished_at: string;
  diagnostic_card: string;
  diagnostic_card_finished_at: string;
  last_tech_inspection_date: string;
  last_inspection_equipment: string;
  mileage: number;
  motohours: number;
  updated_at: string;
  season: string;
  okrug_name: string;
  okrug_id: string;
  last_repair_date: string;
  repair_from_date: string;
  on_base?: boolean;
  data: {
    defects_body: boolean;
    defects_chassis: boolean;
    defects_attachments: boolean;
    incomplete_equipment: boolean;
    liquids_leak: boolean;

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
    not_ready_to_work: boolean;
    comments: string;

    waybill_number?: number;
    mission_numbers?: number;
    not_passed_verification_glonass?: boolean;
    repair_application: string;
    classifier: string;
    tech_inspection_passed: string;
    glonass_stationary: string;
    glonass_registered: string;
    logo: string;
    tech_condition: string;
    repair_reason: string;
    not_maintenance_and_repair?: boolean;
    own_tech_maintenance?: boolean;
  };
  files: any[];
};

export type CarsConditionTableDefects = CarsConditionCars & CarsConditionCars['data'];
