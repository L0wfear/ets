import { InspectAutobase } from './@types/inspect_autobase';
import {
  promiseGetInspectRegistry,
  promiseCreateInspection,
  promiseGetInspectionByIdType,
} from 'redux-main/reducers/modules/inspect/inspect_promise';
import { get, keyBy, cloneDeep } from 'lodash';
import { isNullOrUndefined } from 'util';

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
  is_hard_surface: [],
  surface_in_poor_condition: false,
  surface_area_of_destruction: null,
  presence_of_pits_potholes: null,
  lack_of_lighting: false,
  cnt_defective_light: null,
  lack_control_room: false,
  lack_repair_areas: false,
  cnt_repair_posts: null,
  repair_posts_in_poor_condition: null,
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
  comments: '',
};

const makeInspectAutobase = (inspect: any): InspectAutobase => {
  const inspectAutobase: InspectAutobase = cloneDeep(inspect);

  inspectAutobase.agents_from_gbu = inspectAutobase.agents_from_gbu || [];
  inspectAutobase.commission_members = inspectAutobase.commission_members || [];
  inspectAutobase.files = inspectAutobase.files || [];

  inspectAutobase.data = cloneDeep(defaultInspectAutobaseData);
  Object.keys(inspectAutobase.data).forEach(
    (key) => {
      if (!isNullOrUndefined(get(inspect, `data.${key}`))) {
        inspectAutobase.data[key] = get(inspect, `data.${key}`);
      }
    },
  );

  return inspectAutobase;
};

export const promiseGetInspectAutobase = async (payload: { carpoolId: number }) => {
  const response = await promiseGetInspectRegistry<InspectAutobase>({
    base_id: payload.carpoolId,
    type: 'autobase',
  });

  const data: InspectAutobase[] = response.data.map((inspectAutobase: InspectAutobase) => {
    return makeInspectAutobase(inspectAutobase);
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
  let inspectAutobase: InspectAutobase = await promiseGetInspectionByIdType(
    id,
    'autobase',
  );

  if (inspectAutobase) {
    inspectAutobase = makeInspectAutobase(inspectAutobase);
  }

  return inspectAutobase;
};

export const promiseCreateInspectionAutobase = async (payload: { carpoolId: number; companyId: number }) => {
  let inspectAutobase: InspectAutobase = await promiseCreateInspection({
    base_id: payload.carpoolId,
    company_id: payload.companyId,
    type: 'autobase',
  });

  if (inspectAutobase) {
    inspectAutobase = makeInspectAutobase(inspectAutobase);
  }

  return inspectAutobase;
};
