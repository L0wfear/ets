import { InspectAutobase } from './@types/inspect_autobase';
import { get, keyBy, cloneDeep } from 'lodash';
import { isNullOrUndefined } from 'util';
import { InspectAutobaseService } from 'api/Services';
import { createValidDate } from 'components/@next/@utils/dates/dates';

export const defaultInspectAutobaseData: InspectAutobase['data'] = {
  is_coating_defects: false,
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

export const promiseGetInspectAutobase = async (payload: { base_id: number; }) => {
  let response = null;
  try {
    response = await InspectAutobaseService.get({
      base_id: payload.base_id,
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const data: Array<InspectAutobase> = get(response, ['result', 'rows'], []);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};

/**
 * @todo вынести в inspect_promise
 */
export const promiseGetInspectAutobaseById = async (id: number) => {
  let response = null;
  try {
    response = await InspectAutobaseService.path(id).get(
      {},
    );
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  let inspectAutobase: InspectAutobase = get(response, 'result.rows.0', null);

  if (inspectAutobase) {
    inspectAutobase = makeInspectAutobase(inspectAutobase);
  }

  return inspectAutobase;
};

export const promiseCreateInspectionAutobase = async (payload: { base_id: number; companyId: number; }) => {
  const response = await InspectAutobaseService.path(payload.base_id).post(
    { ...payload },
    false,
    'json',
  );

  let inspectAutobase = get(response, 'result.rows.0', null);

  if (inspectAutobase) {
    inspectAutobase = makeInspectAutobase(inspectAutobase);
  }

  return inspectAutobase;
};

export const promiseUpdateInspectionAutobase = async (id: number, data: InspectAutobase['data'], files: Array<any>, payload: any) => {
  const newPayload = {
    ...payload,
    commission_members: payload.commission_members.map((elem) => ({...elem, assignment_date_start: createValidDate(elem.assignment_date_start)})),
  };

  const response = await InspectAutobaseService.path(id).put(
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
