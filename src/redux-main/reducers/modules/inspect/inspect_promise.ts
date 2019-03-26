import { InspectRegistryService, InspectionService, InspectionActService } from "api/Services";
import {
  get,
  keyBy,
} from 'lodash';
import { InspectAutobase } from "./autobase/@types/inspect_autobase";
import { TypeOfInspect } from "./@types/inspect_reducer";

type PromiseCreateInspectionParameterPayload = {
  base_id: number;
  company_id: number;
  type: 'autobase';
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

  const inspectAutobase = get(response, 'result.rows.0', null);

  return inspectAutobase;
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

export const promiseUpdateInspection = async (id: number, data: InspectAutobase['data'], files: any[], type: TypeOfInspect) => {
  const response = await InspectRegistryService.path(id).put(
    {
      data,
      files,
      type,
    },
    false,
    'json',
  );

  const inspectAutobase = get(response, 'result.rows.0', null);

  return inspectAutobase;
};

export const promiseCloseInspection = async (id: number, data: InspectAutobase['data'], type: TypeOfInspect) => {
  const response = await InspectionService.path(id).path('close').put(
    {
      type,
      data,
    },
    false,
    'json',
  );

  const inspectAutobase = get(response, 'result.rows.0', null);

  return inspectAutobase;
};

export const promiseGetBlobActInspection = async (id: number) => {
  let response = { blob: null };
  try {
    response = await InspectionActService.path(id).getBlob({});
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  return response;
};
