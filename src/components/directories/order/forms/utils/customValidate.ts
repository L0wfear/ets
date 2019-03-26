import { checkMissionsOnStructureIdCar } from 'components/missions/utils/customValidate';
import { typeTemplate } from 'components/directories/order/forms/utils/constant';
import { checkMissionsOnStructureIdBrigade } from 'components/new/pages/missions/duty_mission_template/form/creating/utils';

export const checkStructureByTypeClick = (typeClick, { carsIndex = {}, employeesIndex = {} }, missions) => {
  switch (typeClick) {
    case typeTemplate.missionTemplate: return checkMissionsOnStructureIdCar(missions, carsIndex);
    case typeTemplate.missionDutyTemplate: return checkMissionsOnStructureIdBrigade(missions, employeesIndex);
    default: return false;
  }
};
