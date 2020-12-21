import { cloneDeep, get } from 'lodash';
import { isObject, isNullOrUndefined } from 'util';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { STATUS_INSPECT_COMPLETED, STATUS_INSPECT_CONDITING } from 'redux-main/reducers/modules/inspect/inspect_utils';
import { monitoringKindSeasonReadiness } from 'components/new/pages/inspection/cars_condition/components/select_data/constants';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import { getRegistryState } from 'redux-main/reducers/selectors';

export const defaultInspectCarsCondition: InspectCarsCondition = {
  agents_from_gbu: [],
  fio: null,
  position: null,
  cars_cnt: null,
  checked_cars_cnt: null,
  checks_period: null,
  checks_period_text: null,
  checks_type: null,
  checks_type_text: null,
  close_employee_assignment: null,
  close_employee_assignment_date_start: null,
  close_employee_fio: null,
  close_employee_id: null,
  close_employee_position: null,
  commission_members: [],
  company_id: null,
  company_name: null,
  company_short_name: null,
  head_balance_holder_base: {
    fio: null,
    tel: null,
  },
  head_operating_base: {
    fio: null,
    tel: null,
  },
  date_start: null,
  id: null,
  inspection_company_id: null,
  inspection_company_name: null,
  list_drivers: null,
  list_mechanics: null,
  monitoring_kind: null,
  maintenance: null,
  monitoring_kind_text: null,
  not_used: null,
  open_employee_fio: null,
  open_employee_id: null,
  repair: null,
  resolve_to: null,
  staff_drivers: null,
  staff_mechanics: null,
  staffing_drivers: null,
  staffing_mechanics: null,
  status_text: null,
  storage: null,
  type: 'cars_condition',
  data: {
    types_cars: [],
    types_harvesting_unit: [],
    preparing_cars_check: {
      order_issued_at: null,
      order_number: null,
      master_plan_approved: null,
      named_plan_approved: null,
      no_order: false,
      planned_target: null,
      statements_defects_issued: null,
      statements_defects_not_issued_cnt: null,
      drawbacks_eliminated: null,
      drawbacks_new: null,
      dataForValidation: null,
    },
    headcount: {
      staff_drivers: null,
      staff_mechanics: null,
      list_drivers: null,
      list_mechanics: null,
    },
    cars_use: {
      waybill_issue_log_exists: null,
      waybill_issue_log_used: null,
      comment: null,
      comment_detected: null,
    },
  },
  status: 'conducting',
  date_end: null,
  files: [],
  action: 'save',
  dataForValidation: null,
};

export const getDefaultInspectCarsConditionElement = (element: Partial<InspectCarsCondition>) => {
  const newElement = cloneDeep(defaultInspectCarsCondition);

  if (isObject(element)) {
    Object.keys(defaultInspectCarsCondition).forEach((key) => {
      newElement[key] = isNullOrUndefined(element[key])  || element[key] === ''
        ? defaultInspectCarsCondition[key]
        : element[key];
    });
  }

  return newElement;
};

const isPermittedChangeCloseParams = (inspect_data: InspectCarsCondition, isPermittedToUpdateClose: boolean) => {
  const status = get(inspect_data, 'status');

  return (
    status === STATUS_INSPECT_COMPLETED
    && isPermittedToUpdateClose
  );
};

export const isPermittedEditCarContidion = (inspect_data: InspectCarsCondition, isPermittedToUpdate: boolean) => {
  const status = get(inspect_data, 'status');

  return (
    status === STATUS_INSPECT_CONDITING
    || isPermittedChangeCloseParams(inspect_data, isPermittedToUpdate)
  );
};

export const canCreateCarInCondition = (monitoring_kind: InspectCarsCondition['monitoring_kind'], isPermittedEditCarContidionBool: boolean) => {
  return (
    isPermittedEditCarContidionBool
    && monitoringKindSeasonReadiness.key !== monitoring_kind
  );
};

export const canCreateCarInConditionGlobal = (inspect_data: InspectCarsCondition, isPermittedToUpdateClose: boolean) => {
  const monitoring_kind = get(inspect_data, 'monitoring_kind');
  return canCreateCarInCondition(
    monitoring_kind,
    isPermittedEditCarContidion(inspect_data, isPermittedToUpdateClose),
  );
};

// Проверка на возможность редактирования полей обычной и закрытой проверки
export const isPermittedUpdateCarContidion = (registryKey: string) => {
  const registryPermissions = etsUseSelector((state) => getListData(state.registry, registryKey).permissions);
  const isPermittedToUpdateUser = etsUseIsPermitted(registryPermissions.update);

  const objectExtra = etsUseSelector((state) => getListData(getRegistryState(state), registryKey).data.objectExtra);
  const inspect_data: InspectCarsCondition = get(objectExtra, 'inspect_data');
  const isPermittedToUpdate = isPermittedEditCarContidion(inspect_data, isPermittedToUpdateUser);

  const isPermittedToUpdateCloseUser = etsUseIsPermitted(registryPermissions.update_closed);
  const isPermittedToUpdateClose = isPermittedEditCarContidion(inspect_data, isPermittedToUpdateCloseUser);
  const status = get(inspect_data, 'status');
  const actionType = status === STATUS_INSPECT_COMPLETED && isPermittedToUpdateClose ? 'save_closed' : 'save'; // задаём action для сохранения проверки используетя в PUT

  return {
    isPermittedToUpdate,
    isPermittedToUpdateClose,
    actionType,
  };
};
