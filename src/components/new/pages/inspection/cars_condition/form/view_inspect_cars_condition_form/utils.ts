import { isObject, isNullOrUndefined } from 'util';
import { InspectCarsCondition } from "redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition";

export const defaultInspectCarsCondition: InspectCarsCondition = {
  agents_from_gbu: [],
  fio: '',
  position: '',
  cars_cnt: null,
  checked_cars_cnt: null,
  checks_period: '',
  checks_period_text: '',
  checks_type: '',
  checks_type_text: '',
  close_employee_fio: '',
  close_employee_id: null,
  close_employee_position: '',
  commission_members: [],
  company_id: null,
  company_name: '',
  head_balance_holder_base: {
    fio: '',
    tel: '',
  },
  head_operating_base: {
    fio: '',
    tel: '',
  },
  date_start: null,
  id: null,
  inspection_company_id: null,
  inspection_company_name: '',
  monitoring_kind: '',
  monitoring_kind_text: '',
  open_employee_fio: '',
  open_employee_id: null,
  preparing_cars_check: {
    order_issued_at: '',
    order_number: '',
    master_plan_approved: '',
    named_plan_approved: '',
    planned_target: '',
    statements_defects_issued: '',
    statements_defects_not_issued_cnt: '',
    drawbacks_eliminated: '',
    drawbacks_new: '',
  },
  headcount_list: {
    staff_drivers: null,
    staff_mechanics: null,
    list_drivers: null,
    list_mechanics: null,
    staffing_drivers: null,
    staffing_mechanics: null,
    cars_use: {
      waybill_issue_log_exists: '',
      waybill_issue_log_used: '',
      comment: '',
      comment_detected: '',
    },
  },
  resolve_to: '',
  status_text: '',
  type: 'cars_condition',
  data: {},
  status: 'conducting',
  date_end: null,
  files: [],
};

export const getDefaultInspectCarsConditionElement = (element: Partial<InspectCarsCondition>) => {
  const newElement = { ...defaultInspectCarsCondition };

  if (isObject(element)) {
    Object.keys(defaultInspectCarsCondition).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultInspectCarsCondition[key];
    });
  }

  return newElement;
};
