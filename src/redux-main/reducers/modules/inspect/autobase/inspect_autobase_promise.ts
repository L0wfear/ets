import { InspectAutobase } from "./@types/inspect_autobase";
import {
  promiseGetInspectRegistry,
  promiseCreateInspection,
  promiseGetInspectionByIdType,
} from 'redux-main/reducers/modules/inspect/inspect_promise';
import { get, keyBy } from 'lodash';

export const defaultInspectAutobaseData: InspectAutobase['data'] = {
  is_under_construction: false,
  is_less_than_two_entrances: false,
  absence_of_a_shield_with_a_scheme_of_movement: false,
  is_road_signs: null,
  lack_of_fire_fighting_equipment: false,
  no_fencing: false,
  fencing_in_poor_condition: false,
  is_not_protected: false,
  protection_is_carried: null,
  lack_of_video_surveillance: false,
  is_hard_surface: null,
  surface_in_poor_condition: false,
  surface_area_of_destruction: null,
  presence_of_pits_potholes: null,
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

export const makeFilesForFront = (data: InspectAutobase) => {
  const files = get(data, 'files', []);

  return {
    photos_of_supporting_documents: files.filter(({ kind }) => kind === 'photos_of_supporting_documents'),
    photos_defect: files.filter(({ kind }) => kind === 'photos_defect'),
  };
};

export const makeFilesForBackend = (data: InspectAutobase['data']) => {
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

export const promiseGetInspectAutobase = async (payload: { carpoolId: number }) => {
  const response = await promiseGetInspectRegistry<InspectAutobase>({
    base_id: payload.carpoolId,
    type: 'autobase',
  });

  const data: InspectAutobase[] = response.data.map((inspectAutobase: InspectAutobase) => {
    inspectAutobase.data = {
      ...(inspectAutobase.data || defaultInspectAutobaseData),
      ...makeFilesForFront(inspectAutobase),
    };

    delete inspectAutobase.data.files;

    return inspectAutobase;
  }).sort((a, b) => a.id - b.id);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};

/**
 * @todo вынести в inspect_promise
 */
export const promiseGetInspectAutobaseById = async (id: number) => {
  const inspectAutobase: InspectAutobase = await promiseGetInspectionByIdType(
    id,
    'autobase',
  );

  if (inspectAutobase) {
    inspectAutobase.data = {
      ...(inspectAutobase.data || defaultInspectAutobaseData),
      ...makeFilesForFront(inspectAutobase),
    };

    delete inspectAutobase.data.files;

  }

  return inspectAutobase;
};

export const promiseCreateInspectionAutobase = async (payload: { carpoolId: number; companyId: number }) => {
  const inspectAutobase: InspectAutobase = await promiseCreateInspection({
    base_id: payload.carpoolId,
    company_id: payload.companyId,
    type: 'autobase',
  });

  if (inspectAutobase) {
    inspectAutobase.data = {
      ...(inspectAutobase.data || defaultInspectAutobaseData),
      ...makeFilesForFront(inspectAutobase),
    };
  }

  return inspectAutobase;
};
