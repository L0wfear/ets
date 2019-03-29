import { isObject, isNullOrUndefined } from 'util';
import { get } from 'lodash';
import memoize from 'memoize-one';

import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { createValidDateTime, getTomorrow9am, getToday9am } from 'utils/dates';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import createFio from 'utils/create-fio';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types/index';
import { DUTY_MISSION_STATUS } from 'redux-main/reducers/modules/missions/duty_mission/constants';

export const makeDefaultDutyMission = (): DutyMission => ({
  author: '',
  brigade_employee_id_list: [],
  brigade_employee_id_list_id: [],
  brigade_employee_id_list_fio: [],
  brigade_id: null,
  car_mission_id: null,
  car_mission_name: '',
  comment: '',
  fact_date_end: null,
  fact_date_start: null,
  faxogramm_id: null,
  foreman_fio: '',
  foreman_full_fio: '',
  foreman_id: null,
  id: null,
  is_archive: false,
  is_cleaning_norm: false,
  is_valid_to_order_operation: null,
  mission_source_id: 3,
  mission_source_name: '',
  mission_source_text: '',
  municipal_facility_id: null,
  municipal_facility_name: '',
  norm_id: null,
  norm_text: '',
  number: null,
  object_type_id: null,
  object_type_name: '',
  operation_num_execution: null,
  order_number: null,
  order_operation_id: null,
  order_status: '',
  plan_date_end: createValidDateTime(getTomorrow9am()),
  plan_date_start: createValidDateTime(getToday9am()),
  request_id: null,
  request_number: '',
  route_id: null,
  route_name: '',
  status: DUTY_MISSION_STATUS.not_assigned,
  structure_id: null,
  structure_name: '',
  technical_operation_id: null,
  technical_operation_name: '',
  work_class_id: null,
});

export const getDefaultDutyMissionElement = (
  element?: Partial<DutyMission>,
) => {
  const newElement = makeDefaultDutyMission();
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
  municipalFacilityForMissionList: MunicipalFacility[],
  municipal_facility_id: DutyMission['municipal_facility_id'],
) => {
  return get(
    municipalFacilityForMissionList.find(
      (mfData) => mfData.municipal_facility_id === municipal_facility_id,
    ),
    'route_types',
    [],
  );
};

/**
 * Проверка принадлежности сотрудника к подразделению
 * @param employee данные из /employee? о сотрудника
 * @param structure_id подразделение для валидации
 */
export const isPermittedEmployeeForDutyMission = (employee: Employee | null, structure_id: number | null) => {
  if (!employee) {
    return false;
  }

  const {
    active,
    company_structure_id,
    position_name,
    can_duty_mission,
    is_common,
  } = employee;

  const trigrrerOnPermitted = (
    !!position_name
    && can_duty_mission
    && active
    && (
      is_common
      || !structure_id
      || company_structure_id === structure_id
    )
  );

  return trigrrerOnPermitted;
};

export const makeOptionsByEmployee = memoize(
  (employeeList: Employee[], structure_id: DutyMission['structure_id']) => {
    const FOREMANS = employeeList.reduce<
      DefaultSelectOption<
        Employee['id'],
        string,
        Employee & { active_for_brigade: boolean }
      >[]
    >((newArr, employee) => {
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
);

export const dutyMissionIsDisplay = (status) =>
  Boolean(status) && status !== DUTY_MISSION_STATUS.not_assigned;
export const dutyMissionIsAssigned = (status) =>
  status === DUTY_MISSION_STATUS.assigned;
export const dutyMissionIsComplete = (status) =>
  status === DUTY_MISSION_STATUS.complete;
export const dutyMissionIsClosed = (status) =>
  status === DUTY_MISSION_STATUS.complete ||
  status === DUTY_MISSION_STATUS.fail;
