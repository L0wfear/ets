import { isObject, isNullOrUndefined } from 'util';
import { createValidDateTime, getTomorrow9am, getToday9am } from 'components/@next/@utils/dates/dates';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { isPermittedEmployeeForDutyMission } from '../../../duty_mission/form/main/utils';

export const makeDefaultDutyMissionTemplate = (): Pick<DutyMission, 'plan_date_end' | 'plan_date_start' | 'mission_source_id' | 'mission_source_name'> => ({
  plan_date_end: createValidDateTime(getTomorrow9am()),
  plan_date_start: createValidDateTime(getToday9am()),
  mission_source_id: 3,
  mission_source_name: '',
});

export const getDefaultDutyMissionTemplateElement = (element?: Partial<Pick<DutyMission, 'plan_date_end' | 'plan_date_start' | 'mission_source_id' | 'mission_source_name'>>) => {
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

export const checkMissionsOnStructureIdBrigade = (missionsArr: Array<DutyMissionTemplate>, employeeIndex: Record<Employee['id'], Employee>) => {
  const missionsWithStructureId = missionsArr.filter(({ structure_id }) => !!structure_id);

  if (missionsWithStructureId) {
    const notPermitedMissionsNumber = missionsWithStructureId.reduce((newArr, { foreman_id, brigade_employee_id_list, structure_id, number }) => {
      brigade_employee_id_list.forEach((employeeData) => {
        if (!isPermittedEmployeeForDutyMission(employeeIndex[employeeData.employee_id], structure_id)) {
          newArr.push(`<${number}>`);
        }
      });

      if (!isPermittedEmployeeForDutyMission(employeeIndex[foreman_id], structure_id)) {
        newArr.push(`<${number}>`);
      }

      return newArr;
    }, []);

    if (notPermitedMissionsNumber.length) {
      global.NOTIFICATION_SYSTEM.notify(`Подразделение выбранного шаблона наряд-задания № ${notPermitedMissionsNumber.join(', ')} не соответствует подразделению сотрудника. Необходимо скорректировать шаблон наряд-задания, либо выбрать другой шаблон.`, 'error');
      return true;
    }
  }

  return false;
};
