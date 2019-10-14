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
  fio: '',
  position: '',
  cars_cnt: null,
  checked_cars_cnt: null,
  checks_period: '',
  checks_period_text: '',
  checks_type: '',
  checks_type_text: '',
  close_employee_assignment: '',
  close_employee_assignment_date_start: '',
  close_employee_fio: '',
  close_employee_id: null,
  close_employee_position: '',
  commission_members: [],
  company_id: null,
  company_name: '',
  company_short_name: '',
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
  resolve_to: '',
  status_text: '',
  type: 'cars_condition',
  data: {
    types_cars: [],
    types_harvesting_unit: [],
    preparing_cars_check: {
      order_issued_at: '',
      order_number: '',
      master_plan_approved: '',
      named_plan_approved: '',
      no_order: false,
      planned_target: '',
      statements_defects_issued: '',
      statements_defects_not_issued_cnt: '',
      drawbacks_eliminated: '',
      drawbacks_new: '',
    },
    headcount: {
      staff_drivers: null,
      staff_mechanics: null,
      list_drivers: null,
      list_mechanics: null,
    },
    cars_use: {
      waybill_issue_log_exists: '',
      waybill_issue_log_used: '',
      comment: '',
      comment_detected: '',
    },
  },
  status: 'conducting',
  date_end: null,
  files: [],
  action: 'save',
};

export const getDefaultInspectCarsConditionElement = (element: Partial<InspectCarsCondition>) => {
  const newElement = cloneDeep(defaultInspectCarsCondition);

  if (isObject(element)) {
    Object.keys(defaultInspectCarsCondition).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultInspectCarsCondition[key];
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
