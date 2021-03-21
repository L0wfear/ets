import { InspectPgmBase } from './@types/inspect_pgm_base';
import { get, keyBy, cloneDeep } from 'lodash';
import { isNullOrUndefined } from 'util';
import { InspectPgmBaseService } from 'api/Services';
import { InspectAutobase } from '../autobase/@types/inspect_autobase';
import { createValidDate } from 'components/@next/@utils/dates/dates';

export const defaultInspectPgmBaseData: InspectPgmBase['data'] = {
  lack_traffic_scheme_at_entrance: false,
  type_of_base_coverage: [],
  access_roads_in_poor_condition: false,
  lack_of_lighting: false,
  lack_of_personal_protection: false,
  lack_of_records_in_training_logs: false,
  lack_of_technical_passport: false,
  lack_of_documents_on_pgm: false,
  lack_of_documents_etc: '',
  lack_of_shower: false,
  lack_of_changing_rooms: false,
  lack_of_rest_rooms: false,
  lack_of_information_stands: false,
  lack_of_loading_unloading_mechanisms: false,
  lack_of_ramps_stairs: false,

  lack_of_height_restriction_sign: false,
  type_coverage_in_hangar: [],
  lack_of_lighting_in_hangars: false,
  lack_of_schema_slinging: false,
  lack_of_wooden_pallets: false,
  hangar_is_not_sealed: false,
  pgm_in_hangars: '',
  insufficient_availability_of_wooden_pallets: false,
  lack_of_shelter_for_solid_pgm: false,
  pgm_on_open_area: '',
  additional_fields: [],
  equipment_and_piping_in_poor_condition: false,
  containers_in_poor_condition: false,

  comments: '',
};

const makeInspectPgmBase = (inspect: any): InspectPgmBase => {
  const inspectAutobase: InspectPgmBase = cloneDeep(inspect);

  inspectAutobase.agents_from_gbu = inspectAutobase.agents_from_gbu || [];
  inspectAutobase.commission_members = inspectAutobase.commission_members || [];
  inspectAutobase.files = inspectAutobase.files || [];

  inspectAutobase.data = cloneDeep(defaultInspectPgmBaseData);
  Object.keys(inspectAutobase.data).forEach(
    (key) => {
      if (!isNullOrUndefined(get(inspect, `data.${key}`))) {
        if(key === 'additional_fields') {
          inspectAutobase.data[key] = get(inspect, `data.${key}`, ).map((rowData, index) => {
            rowData.customId = index + 1;
            return rowData;
          })
        }
        inspectAutobase.data[key] = get(inspect, `data.${key}`);
      }
    },
  );

  return inspectAutobase;
};

export const promiseGetInspectPgmBase = async (payload: { base_id: number; }) => {
  let response = null;
  try {
    response = await InspectPgmBaseService.get({
      base_id: payload.base_id,
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const data: Array<InspectPgmBase> = get(response, ['result', 'rows'], []);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};

/**
 * @todo вынести в inspect_promise
 */
export const promiseGetInspectPgmBaseById = async (id: number) => {
  let response = null;
  try {
    response = await InspectPgmBaseService.path(id).get(
      {},
    );
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  let inspectPgmBase: InspectPgmBase = get(response, 'result.rows.0', null);

  if (inspectPgmBase) {
    inspectPgmBase = makeInspectPgmBase(inspectPgmBase);
  }

  return inspectPgmBase;
};

export const promiseCreateInspectionPgmBase = async (payload: { base_id: number; companyId: number; }) => {
  const response = await InspectPgmBaseService.path(payload.base_id).post(
    { ...payload },
    false,
    'json',
  );
  let inspectPgmBase = get(response, 'result.rows.0', null);

  if (inspectPgmBase) {
    inspectPgmBase = makeInspectPgmBase(inspectPgmBase);
  }

  return inspectPgmBase;
};

export const promiseUpdateInspectionPgmBase = async (id: number, data: InspectAutobase['data'], files: Array<any>, payload: any) => {
  const newPayload = {
    ...payload,
    commission_members: payload.commission_members?.map((elem) => ({...elem, assignment_date_start: createValidDate(elem.assignment_date_start)})),
  };

  const response = await InspectPgmBaseService.path(id).put(
    {
      ...newPayload,
      data,
      files,
    },
    false,
    'json',
  );

  const inspectPgmBase = get(response, 'result.rows.0', null);

  return inspectPgmBase;
};
