import { isObject, isNullOrUndefined } from 'util';
import {
  get,
} from 'lodash';

import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { getDateWithMoscowTz, createValidDateTime } from 'components/@next/@utils/dates/dates';

export type GetDefaultMissionTemplateElement = (companyStructure: Partial<MissionTemplate> | null) => MissionTemplate;

export const makeDefaultMissionTemplate = (...arg: any[]): MissionTemplate => ({
  car_gov_numbers: [],
  car_gov_numbers_text: '',
  car_ids: [],
  car_type_ids: [],
  car_type_names: [],
  car_type_name_text: '',
  car_model_names: [],
  car_special_model_names: [],
  comment: '',
  company_id: null,
  date_create: (
    createValidDateTime(
      getDateWithMoscowTz(),
    )
  ),
  description: '',
  for_column: false,
  id: null,
  is_actual: true,
  is_cleaning_norm: [],
  kind_task_ids: [],
  municipal_facility_id: null,
  municipal_facility_name: '',
  name: '',
  number: null,
  passes_count: 1,
  route_id: null,
  route_name: '',
  route_type: '',
  structure_id: null,
  structure_name: '',
  technical_operation_id: null,
  technical_operation_name: '',
  type_oper_id: null,
  work_class_id: null,
});

export const getDefaultMissionTemplateElement: GetDefaultMissionTemplateElement = (element) => {
  const newElement = makeDefaultMissionTemplate();
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
  municipalFacilityForMissionList,
  municipal_facility_id,
  for_column?,
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
