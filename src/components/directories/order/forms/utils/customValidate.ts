import { checkMissionsOnStructureIdCar } from 'components/missions/utils/customValidate';
import { checkMissionsOnStructureIdBrigade } from 'components/missions/utils/customValidate';
import { typeTemplate } from 'components/directories/order/forms/utils/constant';

export const checkStructureByTypeClick = (typeClick, { carsIndex = {}, employeesIndex = {} }, missions) => {
  switch (typeClick) {
    case typeTemplate.missionTemplate: return checkMissionsOnStructureIdCar(missions, carsIndex);
    case typeTemplate.missionDutyTemplate: return checkMissionsOnStructureIdBrigade(missions, employeesIndex);
    default: return false;
  }
};
