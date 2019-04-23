import { typeTemplate } from 'components/directories/order/forms/utils/constant';
import { checkMissionsOnStructureIdBrigade } from 'components/new/pages/missions/duty_mission_template/form/creating/utils';

interface IMission {
  structure_id: number | void;
  car_ids: number[];
  number: number;
  route_type: string;
  is_cleaning_norm: boolean;
}

interface ICar {
  company_structure_id: number | void;
  is_common: boolean;
}
interface ICarsIndex {
  [asuods_id: number]: ICar;
}

type ICheckMissionsOnStructureIdCar = (missionsArr: IMission[], carsIndex: ICarsIndex) => boolean;

export const checkMissionsOnStructureIdCar: ICheckMissionsOnStructureIdCar = (missionsArr, carsIndex) => {
  const missionsWithStructureId = missionsArr.filter(({ structure_id }) => !!structure_id);

  if (missionsWithStructureId) {
    const notPermitedMissionsNumber = missionsWithStructureId.reduce((newArr, { structure_id, car_ids, number }) => {
      car_ids.forEach((car_id) => {
        const { company_structure_id: car_structure_id = null, is_common = false } = carsIndex[car_id] || {};

        if (!is_common && car_structure_id !== structure_id) {
          newArr.push(`<${number}>`);
        }
      });

      return newArr;
    }, []);

    if (notPermitedMissionsNumber.length) {
      global.NOTIFICATION_SYSTEM.notify(`Подразделение выбранного шаблона задания № ${notPermitedMissionsNumber.join(', ')} не соответствует подразделению транспортного средства. Необходимо скорректировать шаблон задания, либо выбрать другой шаблон.`, 'error');
      return true;
    }
  }

  return false;
};

export const checkStructureByTypeClick = (typeClick, { carsIndex = {}, employeesIndex = {} }, missions) => {
  switch (typeClick) {
    case typeTemplate.missionTemplate: return checkMissionsOnStructureIdCar(missions, carsIndex);
    case typeTemplate.missionDutyTemplate: return checkMissionsOnStructureIdBrigade(missions, employeesIndex);
    default: return false;
  }
};
