import { get } from 'lodash';
import memoize from 'memoize-one';

import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { createFio } from 'utils/labelFunctions';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types/index';
import { DUTY_MISSION_STATUS } from 'redux-main/reducers/modules/missions/duty_mission/constants';

export const getAvailableRouteTypesForDutyMission = (
  municipalFacilityForMissionList: Array<MunicipalFacility>,
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
  (employeeList: Array<Employee>, structure_id: DutyMission['structure_id']) => {
    const FOREMANS = employeeList.reduce<
      Array<DefaultSelectOption<
        Employee['id'],
        string,
        Employee & { active_for_brigade: boolean; }
      >>
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
  status === DUTY_MISSION_STATUS.complete
  || status === DUTY_MISSION_STATUS.fail;
