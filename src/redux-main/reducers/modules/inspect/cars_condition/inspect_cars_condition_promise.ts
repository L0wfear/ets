import { InspectCarsCondition, CarsConditionCars } from "./@types/inspect_cars_condition";
import {
  promiseGetInspectRegistry,
  promiseCreateInspection,
  promiseGetInspectionByIdType,
} from 'redux-main/reducers/modules/inspect/inspect_promise';
import { cloneDeep, get, keyBy } from 'lodash';
import { InspectCarsService } from "api/Services";
import { createValidDate } from "utils/dates";

// дефолтное значение для "Руководитель предприятия"
const deafult_head_balance_holder_base: InspectCarsCondition['head_balance_holder_base'] = {
  fio: '',
  tel: '',
};
// дефолтное значение для "Лицо, ответственное"
const default_head_operating_base: InspectCarsCondition['head_operating_base'] = {
  fio: '',
  tel: '',
};
const default_preparing_cars_check: InspectCarsCondition['data']['preparing_cars_check'] = {
  order_issued_at: '',
  order_number: '',
  master_plan_approved: '',
  named_plan_approved: '',
  planned_target: '',
  statements_defects_issued: '',
  statements_defects_not_issued_cnt: '',
  drawbacks_eliminated: '',
  drawbacks_new: '',
};
const default_headcount_list: InspectCarsCondition['data']['headcount_list'] = {
  staff_drivers: null,
  staff_mechanics: null,
  list_drivers: null,
  list_mechanics: null,
  staffing_drivers: null,
  staffing_mechanics: null,
};

const default_cars_use: InspectCarsCondition['data']['cars_use'] = {
  waybill_issue_log_exists: '',
  waybill_issue_log_used: '',
  comment: '',
  comment_detected: '',
};

const makeInspectCarsConditionFront = (inspectCarsConditionBackend) => {
  const inspectCarsCondition: InspectCarsCondition = cloneDeep(inspectCarsConditionBackend);

  inspectCarsCondition.head_balance_holder_base = get(inspectCarsCondition, 'head_balance_holder_base', deafult_head_balance_holder_base);
  inspectCarsCondition.head_operating_base = get(inspectCarsCondition, 'head_operating_base', default_head_operating_base);

  inspectCarsCondition.data = {
    types_cars: get(inspectCarsCondition, 'data.types_cars', []).map((rowData, index) => {
      rowData.customId = index + 1;
      rowData.disabled = true;
      return rowData;
    }),
    types_harvesting_unit: get(inspectCarsCondition, 'data.types_harvesting_unit', []).map((rowData, index) => {
      rowData.customId = index + 1;
      return rowData;
    }),
    preparing_cars_check: get(inspectCarsCondition, 'data.preparing_cars_check', default_preparing_cars_check),
    headcount_list: get(inspectCarsCondition, 'data.headcount_list', default_headcount_list),
    cars_use: get(inspectCarsCondition, 'data.cars_use', default_cars_use),
  };
  inspectCarsCondition.files = get(inspectCarsCondition, 'files', []);

  inspectCarsCondition.data.preparing_cars_check.order_issued_at = createValidDate(inspectCarsCondition.data.preparing_cars_check.order_issued_at);
  return inspectCarsCondition;
};

export const promiseGetInspectCarsCondition = async (payload: { carsConditionId: number }) => {
  const response = await promiseGetInspectRegistry<InspectCarsCondition>({
    base_id: payload.carsConditionId,
    type: 'cars_condition',
  });

  const data: InspectCarsCondition[] = response.data;
  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};

/**
 * @todo вынести в inspect_promise
 */
export const promiseGetInspectCarsConditionById = async (id: number) => {
  const inspectCarsCondition: InspectCarsCondition = await promiseGetInspectionByIdType(
    id,
    'cars_condition',
  );

  return makeInspectCarsConditionFront(inspectCarsCondition);
};

export const promiseCreateInspectionCarsCondition = async (payload: { carsConditionId: number; companyId: number }) => {
  const inspectCarsCondition: InspectCarsCondition = await promiseCreateInspection({
    base_id: payload.carsConditionId,
    company_id: payload.companyId,
    type: 'cars_condition',
  });

  return inspectCarsCondition;
};

export const promiseGetSetCarsConditionCars = async (inspection_id: number) => {
  const response = await InspectCarsService.get({ inspection_id });

  const result = get(response, 'result.rows', []);

  return result;
};

export const promiseGetCarsConditionsCarById = async (id: CarsConditionCars['id']) => {
  const response = await InspectCarsService.path(id).get();

  const result: CarsConditionCars = get(response, 'result.rows.0', []);

  return result;
};

export const promiseCreateCarsConditionsCar = async (carsConditionsCarRaw: Partial<CarsConditionCars>) => {
  const response = await InspectCarsService.post(
    { ...carsConditionsCarRaw },
    false,
    'json',
  );

  return response;
};

export const promiseUpdateCarsConditionsCar = async (carsConditionsCarRaw: Partial<CarsConditionCars>) => {
  const response = await InspectCarsService.path(carsConditionsCarRaw.id).put(
    { ...carsConditionsCarRaw },
    false,
    'json',
  );

  return response;
};
