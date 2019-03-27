import { InspectPgmBase } from "./@types/inspect_pgm_base";
import {
  promiseGetInspectRegistry,
  promiseCreateInspection,
  promiseGetInspectionByIdType,
} from 'redux-main/reducers/modules/inspect/inspect_promise';
import { get, keyBy } from 'lodash';

export const defaultInspectPgmBaseData: InspectPgmBase['data'] = {
  is_under_construction: false,
  is_less_than_two_entrances: false,
  absence_of_a_shield_with_a_scheme_of_movement: false,
  is_road_signs: false,
  lack_of_fire_fighting_equipment: false,
  no_fencing: false,
  fencing_in_poor_condition: false,
  is_not_protected: false,
  protection_is_carried: null,
  lack_of_video_surveillance: false,
  is_hard_surface: null,
  surface_in_poor_condition: false,
  surface_area_of_destruction: null,
  presence_of_pits_potholes: false,
  lack_of_lighting: false,
  cnt_defective_light: null,
  lack_control_room: false,
  lack_repair_areas: false,
  cnt_repair_posts: null,
  repair_posts_in_poor_condition: false,
  lack_of_storage_facilities: false,
  lack_of_a_canopy_for_pgm: false,
  lack_of_washing: false,
  lack_of_recreation: false,
  lack_of_domestic: false,
  domestic_in_poor_condition: false,
  lack_of_water_supply: false,
  lack_of_sanitation: false,
  lack_of_toilets: false,
  lack_shower_cabins: false,
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
    inspectPgmBase.data = {
      ...(inspectPgmBase.data || defaultInspectPgmBaseData),
      ...makeFilesForFront(inspectPgmBase),
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
