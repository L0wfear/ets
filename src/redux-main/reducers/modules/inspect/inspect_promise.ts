import { InspectRegistryService, InspectionActService } from 'api/Services';
import {
  get,
  keyBy,
} from 'lodash';
import { InspectAutobase } from './autobase/@types/inspect_autobase';
import { TypeOfInspect } from './@types/inspect_reducer';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { createValidDate } from 'components/@next/@utils/dates/dates';

type PromiseCreateInspectionParameterPayload = {
  base_id: number;
  company_id: number;
  type: TypeOfInspect;
};

export const promiseGetInspectRegistry = async <T>(payload: object) => {
  let response = null;
  try {
    response = await InspectRegistryService.get({
      ...payload,
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const data: Array<T> = get(response, ['result', 'rows'], []);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};

export const promiseGetInspectionByIdType = async (id: number) => {
  let response = null;
  try {
    response = await InspectRegistryService.path(id).get(
      {},
    );
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const inspect = get(response, 'result.rows.0', null);

  return inspect;
};

export const promiseCreateInspection = async (payload: PromiseCreateInspectionParameterPayload) => {
  const response = await InspectRegistryService.post(
    { ...payload },
    false,
    'json',
  );

  const inspectAutobase = get(response, 'result.rows.0', null);

  return inspectAutobase;
};

export const promiseUpdateInspection = async (id: number, data: InspectAutobase['data'], files: Array<any>, payload: any) => {
  const newPayload = {
    ...payload,
    commission_members: payload.commission_members.map((elem) => ({...elem, assignment_date_start: createValidDate(elem.assignment_date_start)})),
  };

  const response = await InspectRegistryService.path(id).put(
    {
      ...newPayload,
      data,
      files,
    },
    false,
    'json',
  );

  const inspectAutobase = get(response, 'result.rows.0', null);

  return inspectAutobase;
};

export const promiseGetBlobActInspection = async (inspection_id: number) => {
  let response = { blob: null };
  try {
    response = await InspectionActService.getBlob({ inspection_id });
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  return response;
};

export const promiseUpdatePreparePlan = async (id: number, payload: {types_cars: InspectCarsCondition['data']['types_cars']; types_harvesting_unit: InspectCarsCondition['data']['types_harvesting_unit'];}) => {
  const newPayload = {
    ...payload,
  };

  const response = await InspectRegistryService.path(`${id}/cars_preparation_plan`).put(
    {
      ...newPayload,
    },
    false,
    'json',
  );

  const inspectAutobase = get(response, 'result.rows.0', null);

  return inspectAutobase;
};
