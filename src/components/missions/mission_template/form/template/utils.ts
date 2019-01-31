import { isObject, isNullOrUndefined } from 'util';
import {
  get,
  find,
} from 'lodash';

import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { InitialStateSession, OneSessionStructure } from 'redux-main/reducers/modules/session/session.d';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { getDateWithMoscowTz, createValidDateTime } from 'utils/dates';

export type GetDefaultMissionTemplateElement = (companyStructure: Partial<MissionTemplate> | null) => MissionTemplate;

export const makeDefaultMissionTemplate = (...arg: any[]): MissionTemplate => ({
  car_gov_numbers: [],
  car_gov_numbers_text: '',
  car_ids: [],
  car_type_id: [],
  car_type_name: [],
  car_type_name_text: '',
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

export const getStructureParam = (userStructureId: InitialStateSession['userData']['structure_id'], STRUCTURES: DefaultSelectListMapper<OneSessionStructure>) => {
  let STRUCTURE_FIELD_VIEW = false;
  let STRUCTURE_FIELD_READONLY = false;
  let STRUCTURE_FIELD_DELETABLE = false;

  if (userStructureId !== null && STRUCTURES.length === 1 && userStructureId === STRUCTURES[0].value) { // когда пользователь привязан к конкретному подразделению
    STRUCTURE_FIELD_VIEW = true;
    STRUCTURE_FIELD_READONLY = true;
  } else if (userStructureId !== null && STRUCTURES.length > 1 && find(STRUCTURES, (el) => el.value === userStructureId)) {
    STRUCTURE_FIELD_VIEW = true;
  } else if (userStructureId === null && STRUCTURES.length > 0) {
    STRUCTURE_FIELD_VIEW = true;
    STRUCTURE_FIELD_DELETABLE = true;
  }

  return {
    STRUCTURE_FIELD_VIEW,
    STRUCTURE_FIELD_READONLY,
    STRUCTURE_FIELD_DELETABLE,
  };
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
