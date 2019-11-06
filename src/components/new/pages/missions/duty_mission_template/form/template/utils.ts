import { isObject, isNullOrUndefined } from 'util';
import {
  get,
} from 'lodash';
import memoize from 'memoize-one';

import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { getDateWithMoscowTz, createValidDateTime } from 'components/@next/@utils/dates/dates';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { createFio } from 'utils/labelFunctions';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types/index';
import { isPermittedEmployeeForDutyMission } from '../../../duty_mission/form/main/utils';

export const makeDefaultDutyMissionTemplate = (): DutyMissionTemplate => ({
  brigade_employee_id_list: [],
  brigade_employee_id_list_id: [],
  brigade_employee_id_list_fio: [],
  brigade_id: null,
  comment: '',
  date_create: createValidDateTime(
    getDateWithMoscowTz(),
  ),
  foreman_fio: '',
  foreman_full_fio: '',
  foreman_id: null,
  id: null,
  is_actual: true,
  kind_task_ids: [],
  municipal_facility_id: null,
  municipal_facility_name: '',
  norm_id: null,
  number: null,
  route_id: null,
  route_name: '',
  structure_id: null,
  structure_name: '',
  technical_operation_id: null,
  technical_operation_name: '',
  work_class_id: null,
});

export const getDefaultDutyMissionTemplateElement = (element?: Partial<DutyMissionTemplate>) => {
  const newElement = makeDefaultDutyMissionTemplate();
  if (isObject(element)) {
    Object.keys(newElement).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};

export const getAvailableRouteTypesForDutyMission = (
  municipalFacilityForMissionList: Array<MunicipalFacility>,
  municipal_facility_id: DutyMissionTemplate['municipal_facility_id'],
) => {
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

export const makeOptionsByEmployee = (
  memoize(
    (
      employeeList: Array<Employee>,
      structure_id: DutyMissionTemplate['structure_id'],
    ) => {
      const FOREMANS = employeeList.reduce<Array<DefaultSelectOption<Employee['id'], string, Employee & { active_for_brigade: boolean; }>>>((newArr, employee) => {
        const isPermitted = isPermittedEmployeeForDutyMission(
          employee,
          structure_id,
        );

        if (isPermitted) {
          newArr.push({
            value: employee.id,
            label: createFio(employee, true),
            rowData: {
              active_for_brigade: true,
              ...employee,
            },
          });
        }

        return newArr;

      }, []);

      return FOREMANS;
    },
  )
);
