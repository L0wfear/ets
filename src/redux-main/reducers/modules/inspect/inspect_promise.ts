import { InspectRegistryService, InspectionService, InspectionActService } from "api/Services";
import {
  get,
  keyBy,
} from 'lodash';
import { InspectAutobase } from "./autobase/@types/inspect_autobase";
import { ViewAddInspectEmployeeInitialState } from "components/new/pages/inspection/autobase/form/view_inspect_autobase_form/add_inspect_employee/addInspectEmployee";
import { TypeOfInspect } from "./@types/inspect_reducer";
import { InspectPgmBase } from "./pgm_base/@types/inspect_pgm_base";

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

export const promiseUpdateInspection = async (id: number, data: InspectAutobase['data'], files: any[], type: TypeOfInspect, payload: any) => {
  const response = await InspectRegistryService.path(id).put(
    {
      data,
      files,
      type,
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
      data: InspectAutobase['data'] & InspectPgmBase['data'];
      agents_from_gbu: ViewAddInspectEmployeeInitialState['agents_from_gbu'];
      commission_members: ViewAddInspectEmployeeInitialState['commission_members'];
      resolve_to: ViewAddInspectEmployeeInitialState['resolve_to'];
    },
    type: TypeOfInspect,
  ) => {

  const {
    data,
    agents_from_gbu,
    commission_members,
    resolve_to,
  } = payload;

  const {
    head_balance_holder_base_fio,
    head_balance_holder_base_tel,
    head_operating_base_fio,
    head_operating_base_tel,
  } = data;

  delete data.head_balance_holder_base_fio;
  delete data.head_balance_holder_base_tel;
  delete data.head_operating_base_fio;
  delete data.head_operating_base_tel;
  delete data.address_base;
  delete data.balance_holder_base;
  delete data.operating_base;

  const responsePayload =
    type === 'pgm_base'
    ? {
      type,
      data,
      agents_from_gbu,
      commission_members,
      resolve_to,
      head_balance_holder_base: {
        fio: head_balance_holder_base_fio,
        tel: head_balance_holder_base_tel,
      },
      head_operating_base: {
        fio: head_operating_base_fio,
        tel: head_operating_base_tel,
      },
    }
    : {
      type,
      data,
      agents_from_gbu,
      commission_members,
      resolve_to,
    };
  const response = await InspectionService.path(id).path('close').put(
    {
      ...responsePayload,
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
