import { InspectPgmBase } from './@types/inspect_pgm_base';
import {
  promiseGetInspectRegistry,
  promiseCreateInspection,
  promiseGetInspectionByIdType,
} from 'redux-main/reducers/modules/inspect/inspect_promise';
import { get, keyBy, cloneDeep } from 'lodash';
import { isNullOrUndefined } from 'util';

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
        inspectAutobase.data[key] = get(inspect, `data.${key}`);
      }
    },
  );

  return inspectAutobase;
};

export const promiseGetInspectPgmBase = async (payload: { pgmBaseId: number; }) => {
  const response = await promiseGetInspectRegistry<InspectPgmBase>({
    base_id: payload.pgmBaseId,
    type: 'pgm_base',
  });

  const data: Array<InspectPgmBase> = response.data.map((inspectPgmBase: InspectPgmBase) => {
    return makeInspectPgmBase(inspectPgmBase);
  }).sort((a, b) => a.id - b.id);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};

/**
 * @todo вынести в inspect_promise
 */
export const promiseGetInspectPgmBaseById = async (id: number) => {
  let inspectPgmBase: InspectPgmBase = await promiseGetInspectionByIdType(
    id,
  );

  if (inspectPgmBase) {
    inspectPgmBase = makeInspectPgmBase(inspectPgmBase);
  }

  return inspectPgmBase;
};

export const promiseCreateInspectionPgmBase = async (payload: { pgmBaseId: number; companyId: number; }) => {
  let inspectPgmBase: InspectPgmBase = await promiseCreateInspection({
    base_id: payload.pgmBaseId,
    company_id: payload.companyId,
    type: 'pgm_base',
  });

  if (inspectPgmBase) {
    inspectPgmBase = makeInspectPgmBase(inspectPgmBase);
  }

  return inspectPgmBase;
};
