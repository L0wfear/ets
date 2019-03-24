import { isObject, isNullOrUndefined } from 'util';
import {
  get,
} from 'lodash';

import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { getDateWithMoscowTz, createValidDateTime, getTomorrow9am } from 'utils/dates';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';

export type GetDefaultMissionElement = (companyStructure: Partial<Mission> | null) => Mission;

export const makeDefaultMission = (...arg: any[]): Mission => ({
  author: '',
  can_be_closed: false,
  can_edit_car_and_route: false,
  car_gov_number: '',
  car_gov_numbers: [],
  car_id: null,
  car_ids: [],
  car_model_name: '',
  car_model_names: [],
  car_special_model_name: '',
  car_special_model_names: [],
  car_type_id: null,
  car_type_ids: [],
  car_type_name: '',
  car_type_names: [],
  column_id: null,
  comment: '',
  current_percentage: null,
  date_end: createValidDateTime(getTomorrow9am()),
  date_start: createValidDateTime(getDateWithMoscowTz()),
  description: '',
  id: null,
  is_archive: false,
  is_new: true,
  is_valid_to_order_operation: null,
  for_column: false,
  mission_source_id: 3,
  mission_source_name: '',
  mission_source_text: '',
  municipal_facility_id: null,
  municipal_facility_name: '',
  name: '',
  norm_id: null,
  norm_ids: [],
  norm_text: '',
  number: null,
  object_type_id: null,
  object_type_name: '',
  operation_num_execution: null,
  faxogramm_id: null,
  order_id: null,
  order_number: null,
  order_operation_id: null,
  order_status: '',
  passes_count: 1,
  request_id: null,
  request_number: '',
  route_id: null,
  route_name: '',
  status: '', // @todo
  structure_id: null,
  structure_name: '',
  technical_operation_id: null,
  technical_operation_name: '',
  type_id: null,
  type_name: '',
  waybill_id: null,
  waybill_number: null,
});

export const getDefaultMissionElement: GetDefaultMissionElement = (element) => {
  const newElement = makeDefaultMission();
  if (isObject(element)) {
    Object.keys(newElement).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};

export const getAvailableRouteTypes = (
  municipalFacilityForMissionList: MunicipalFacility[],
  municipal_facility_id: Mission['municipal_facility_id'] | MissionTemplate['municipal_facility_id'],
  for_column?: boolean,
) => {
  if (for_column) {
    return ['mixed'];
  }

  return get(
    municipalFacilityForMissionList.find(
      (mfData) => (
        mfData.municipal_facility_id === municipal_facility_id
      ),
    ),
    'route_types',
    [],
  );
};
