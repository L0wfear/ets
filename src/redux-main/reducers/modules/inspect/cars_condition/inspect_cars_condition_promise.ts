import { InspectCarsCondition, CarsConditionCars } from './@types/inspect_cars_condition';
import { cloneDeep, get, keyBy } from 'lodash';
import { InspectCarsConditionService, InspectCarsService, } from 'api/Services';
import { defaultInspectCarsCondition } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/utils';
import { isNullOrUndefined } from 'util';
import { InspectAutobase } from '../autobase/@types/inspect_autobase';
import { createValidDate } from 'components/@next/@utils/dates/dates';

// дефолтное значение для "Руководитель предприятия"
const deafult_head_balance_holder_base: InspectCarsCondition['head_balance_holder_base'] = {
  fio: null,
  tel: null,
};
// дефолтное значение для "Лицо, ответственное"
const default_head_operating_base: InspectCarsCondition['head_operating_base'] = {
  fio: null,
  tel: null,
};
const default_preparing_cars_check: InspectCarsCondition['data']['preparing_cars_check'] = {
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
};
const default_headcount: InspectCarsCondition['data']['headcount'] = {
  staff_drivers: null,
  staff_mechanics: null,
  list_drivers: null,
  list_mechanics: null,
};

const default_cars_use: InspectCarsCondition['data']['cars_use'] = {
  waybill_issue_log_exists: null,
  waybill_issue_log_used: null,
  comment: null,
  comment_detected: null,
};

const makeInspectCarsConditionFront = (inspectCarsConditionBackend) => {
  // if (inspectCarsConditionBackend) {
  const inspectCarsCondition: InspectCarsCondition = cloneDeep(inspectCarsConditionBackend);

  inspectCarsCondition.head_balance_holder_base = get(inspectCarsCondition, 'head_balance_holder_base', cloneDeep(deafult_head_balance_holder_base));
  inspectCarsCondition.head_operating_base = get(inspectCarsCondition, 'head_operating_base', cloneDeep(default_head_operating_base));

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
    preparing_cars_check: get(inspectCarsCondition, 'data.preparing_cars_check', cloneDeep(default_preparing_cars_check)),
    headcount: get(inspectCarsCondition, 'data.headcount', cloneDeep(default_headcount)),
    cars_use: {
      ...cloneDeep(default_cars_use),
      ...get(inspectCarsCondition, 'data.cars_use', {}),
    },
  };
  inspectCarsCondition.files = get(inspectCarsCondition, 'files', []);

  return inspectCarsCondition;
  // }

  // return null;
};

export const makeInspectCarsConditionBack = (inspectCarsConditionFront) => {
  const inspectCarsCondition: InspectCarsCondition = cloneDeep(inspectCarsConditionFront);

  inspectCarsCondition.data.types_cars = !isNullOrUndefined(inspectCarsConditionFront.data.types_cars)
    ? inspectCarsConditionFront.data.types_cars.map((rowData, index) => {
      delete rowData.customId;
      delete rowData.disabled;
      return rowData;
    })
    : defaultInspectCarsCondition?.data?.types_cars;
  inspectCarsCondition.data.types_harvesting_unit = !isNullOrUndefined(inspectCarsConditionFront.data.types_harvesting_unit)
    ? inspectCarsConditionFront.data.types_harvesting_unit.map((rowData, index) => {
      delete rowData.customId;
      return rowData;
    })
    : defaultInspectCarsCondition?.data?.types_harvesting_unit;

  return inspectCarsCondition;
};

export const makeInspectCarsConditionExtendedFront = (elem) => { // Перенос data на верхний уровень
  const dataVal = get(elem, 'data', null);
  if (dataVal) {
    delete elem.data;
    return {
      ...elem,
      ...dataVal,
    };
  } else {
    return elem;
  }
};

export const promiseGetInspectCarsCondition = async (payload: { company_id: number; }) => {
  let response = null;
  try {
    response = await InspectCarsConditionService.get({
      company_id: payload.company_id,
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const data: Array<InspectCarsCondition> = get(response, ['result', 'rows'], []);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};

/**
 * @todo вынести в inspect_promise
 */
export const promiseGetInspectCarsConditionById = async (id: number) => {
  let response = null;
  try {
    response = await InspectCarsConditionService.path(id).get(
      {},
    );
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  let inspectCarsCondition: InspectCarsCondition = get(response, 'result.rows.0', null);

  if (inspectCarsCondition) {
    inspectCarsCondition = makeInspectCarsConditionFront(inspectCarsCondition);
  }

  return inspectCarsCondition;
};

export const promiseCreateInspectionCarsCondition = async (payload: { company_id: number; }) => {
  const response = await InspectCarsConditionService.path(payload.company_id).post(
    { ...payload },
    false,
    'json',
  );
 
  let inspectCarsCondition = get(response, 'result.rows.0', null);
 
  if (inspectCarsCondition) {
    inspectCarsCondition = makeInspectCarsConditionFront(inspectCarsCondition);
  }
 
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

export const promiseUpdateInspectionCarsCondition = async (id: number, data: InspectAutobase['data'], files: Array<any>, payload: any) => {
  const newPayload = {
    ...payload,
    commission_members: payload.commission_members?.map((elem) => ({...elem, assignment_date_start: createValidDate(elem.assignment_date_start)})),
  };

  const response = await InspectCarsConditionService.path(id).put(
    {
      ...newPayload,
      data,
      files,
    },
    false,
    'json',
  );

  const inspectCarsCondition = get(response, 'result.rows.0', null);

  return inspectCarsCondition;
};