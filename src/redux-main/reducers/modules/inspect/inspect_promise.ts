import { InspectRegistryService, InspectionService, InspectionActService } from 'api/Services';
import {
  get,
  keyBy,
} from 'lodash';
import { InspectAutobase } from './autobase/@types/inspect_autobase';
import { TypeOfInspect } from './@types/inspect_reducer';
import { InspectPgmBase } from './pgm_base/@types/inspect_pgm_base';
import { InspectCarsCondition } from './cars_condition/@types/inspect_cars_condition';

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

  const data: T[] = get(response, ['result', 'rows'], []);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};

export const promiseGetInspectionByIdType = async (id: number, type: TypeOfInspect) => {
  let response = null;
  try {
    response = await InspectRegistryService.path(id).get(
      { type },
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

export const promiseUpdateInspection = async (id: number, data: InspectAutobase['data'], files: any[], type: TypeOfInspect, payload: any) => {
  const response = await InspectRegistryService.path(id).put(
    {
      data,
      files,
      type,
      action: 'save',
      ...payload,
    },
    false,
    'json',
  );

  const inspectAutobase = get(response, 'result.rows.0', null);

  return inspectAutobase;
};

export const promiseCloseInspection = async (
    id: number,
    payload: {
      data: InspectAutobase['data'] | InspectPgmBase['data'] | InspectCarsCondition['data'];
      agents_from_gbu: any[];
      commission_members: any[];
      resolve_to: string;
    },
    type: TypeOfInspect,
  ) => {

  const responsePayload = {
    type,
    ...payload,
  };
  const response = await InspectionService.path(id).put(
    {
      ...responsePayload,
      action: 'close',
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
