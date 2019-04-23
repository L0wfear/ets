import { InspectPgmBase } from "./@types/inspect_pgm_base";
import {
  promiseGetInspectRegistry,
  promiseCreateInspection,
  promiseGetInspectionByIdType,
} from 'redux-main/reducers/modules/inspect/inspect_promise';
import { get, keyBy } from 'lodash';

export const defaultInspectPgmBaseData: InspectPgmBase['data'] = {
  address_base: null,
  balance_holder_base: null,
  head_balance_holder_base_fio: null,
  head_balance_holder_base_tel: null,
  operating_base: null,
  head_operating_base_fio: null,
  head_operating_base_tel: null,
  head_balance_holder_base: {
    tel: null,
    fio: null,
  },
  head_operating_base: {
    tel: null,
    fio: null,
  },
  lack_traffic_scheme_at_entrance: false,
  type_of_base_coverage: null,
  access_roads_in_poor_condition: false,
  lack_of_lighting: false,
  lack_of_personal_protection: false,
  lack_of_records_in_training_logs: false,
  lack_of_technical_passport: false,
  lack_of_documents_on_pgm: false,
  lack_of_documents_etc: null,
  lack_of_shower: false,
  lack_of_changing_rooms: false,
  lack_of_rest_rooms: false,
  lack_of_information_stands: false,
  lack_of_loading_unloading_mechanisms: false,
  lack_of_ramps_stairs: false,

  lack_of_height_restriction_sign: false,
  type_coverage_in_hangar: null,
  lack_of_lighting_in_hangars: false,
  lack_of_schema_slinging: false,
  lack_of_wooden_pallets: false,
  hangar_is_not_sealed: false,
  pgm_in_hangars: null,
  insufficient_availability_of_wooden_pallets: false,
  lack_of_shelter_for_solid_pgm: false,
  pgm_on_open_area: null,

  containers_counter: 0,
  summ_capacity: 0,
  pgm_volume_sum: 0,

  equipment_and_piping_in_poor_condition: false,
  containers_in_poor_condition: false,

  files: [],
  photos_of_supporting_documents: [],
  photos_defect: [],
};

export const makeFilesForFront = (data: InspectPgmBase) => {
  const files = get(data, 'files', []);

  return {
    photos_of_supporting_documents: files.filter(({ kind }) => kind === 'photos_of_supporting_documents'),
    photos_defect: files.filter(({ kind }) => kind === 'photos_defect'),
  };
};

export const makeFilesForBackend = (data: InspectPgmBase['data']) => {
  return [
    ...data.photos_of_supporting_documents.map((files: any) => {
      files.kind = 'photos_of_supporting_documents';

      return files;
    }),
    ...data.photos_defect.map((files: any) => {
      files.kind = 'photos_defect';

      return files;
    }),
  ];
};

export const promiseGetInspectPgmBase = async (payload: { pgmBaseId: number }) => {
  const response = await promiseGetInspectRegistry<InspectPgmBase>({
    base_id: payload.pgmBaseId,
    type: 'pgm_base',
  });

  const data: InspectPgmBase[] = response.data.map((inspectPgmBase: InspectPgmBase) => {
    inspectPgmBase.data = {
      ...(inspectPgmBase.data || defaultInspectPgmBaseData),
      ...makeFilesForFront(inspectPgmBase),
    };

    delete inspectPgmBase.data.files;

    return inspectPgmBase;
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
  const inspectPgmBase: InspectPgmBase = await promiseGetInspectionByIdType(
    id,
    'pgm_base',
  );

  if (inspectPgmBase) {
    const headData = {
      head_balance_holder_base_fio: get(inspectPgmBase, 'head_balance_holder_base.fio', null),
      head_balance_holder_base_tel: get(inspectPgmBase, 'head_balance_holder_base.tel', null),
      head_operating_base_fio: get(inspectPgmBase, 'head_operating_base.fio', null),
      head_operating_base_tel: get(inspectPgmBase, 'head_operating_base.tel', null),
    };
    inspectPgmBase.data = {
      ...(inspectPgmBase.data || defaultInspectPgmBaseData),
      ...makeFilesForFront(inspectPgmBase),
      ...headData,
    };

    delete inspectPgmBase.data.files;

  }

  return inspectPgmBase;
};

export const promiseCreateInspectionPgmBase = async (payload: { pgmBaseId: number; companyId: number }) => {
  const inspectPgmBase: InspectPgmBase = await promiseCreateInspection({
    base_id: payload.pgmBaseId,
    company_id: payload.companyId,
    type: 'pgm_base',
  });

  if (inspectPgmBase) {
    inspectPgmBase.data = {
      ...(inspectPgmBase.data || defaultInspectPgmBaseData),
      ...makeFilesForFront(inspectPgmBase),
    };
  }

  return inspectPgmBase;
};
