import { routeTypesBySlug } from 'constants/route';
import { diffDates } from 'utils/dates';

interface IMission {
  structure_id: number | void;
  car_id: number;
  number: number;
  route_type: string;
  is_cleaning_norm: boolean;
}
interface IDutyMission {
  structure_id: number | void;
  number: number;
  foreman_id: number;
  brigade_employee_id_list: { employee_id: number }[];
}

interface ICar {
  company_structure_id: number | void;
}
interface ICarsIndex {
  [asuods_id: number]: ICar;
}
interface IEmployee {
  company_structure_id: number | void;
}
interface IEmployeesIndex {
  [id: number]: IEmployee;
}

interface IFormState {
  date_start: string;
  date_end: string;
}

type ICheckMissionsOnStructureIdCar = (missionsArr: IMission[], carsIndex: ICarsIndex) => boolean;
type ICheckMissionsOnStructureIdBrigade = (missionsArr: IDutyMission[], employeesIndex: IEmployeesIndex) => boolean;
type ICheckMissionsByRouteType = (missionsArr: IMission[], formState: IFormState ) => boolean;

export const checkMissionsOnStructureIdCar: ICheckMissionsOnStructureIdCar = (missionsArr, carsIndex) => {
  const missionsWithStructureId = missionsArr.filter(({ structure_id }) => !!structure_id);

  if (missionsWithStructureId) {
    const notPermitedMissionsNumber = missionsWithStructureId.reduce((newArr, { structure_id, car_id, number }) => {
      const { company_structure_id: car_structure_id = null } = carsIndex[car_id] || {};

      if (car_structure_id !== structure_id) {
        newArr.push(`<${number}>`);
      }

      return newArr;
    }, []);

    if (notPermitedMissionsNumber.length) {
      global.NOTIFICATION_SYSTEM.notify(`Подразделение выбранного шаблона задания № ${notPermitedMissionsNumber.join(', ')} не соответствует подразделению транспортного средства. Необходимо скорректировать шаблон задания, либо выбрать другой шаблон.`, 'error');
      return true;
    }
  }

  return false;
};

export const checkMissionsOnStructureIdBrigade: ICheckMissionsOnStructureIdBrigade = (missionsArr, employeesIndex) => {
  const missionsWithStructureId = missionsArr.filter(({ structure_id }) => !!structure_id);

  if (missionsWithStructureId) {
    const notPermitedMissionsNumber = missionsWithStructureId.reduce((newArr, { foreman_id, brigade_employee_id_list = [], structure_id, number }) => {
      brigade_employee_id_list.forEach(({ employee_id }) => {
        const { company_structure_id: employee_structure_id = null } = employeesIndex[employee_id] || {};

        if (employee_structure_id !== structure_id) {
          newArr.push(`<${number}>`);
        }
      });

      const { company_structure_id: foreman_structure_id = null } = employeesIndex[foreman_id] || {};
      if (foreman_structure_id !== structure_id) {
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

/**
 * Проверка длительности задания по типу маршрута
 * Если тест пройдет,
 * @param missionsArr массив заданий
 * @param dates - объект с датами date_start и date_end
 * @returns flag: boolean - false, если нет ошибки
 */
export const checkMissionsByRouteType: ICheckMissionsByRouteType = (missionsArr, { date_start, date_end }) => {
  let type = '';
  const missionList = missionsArr.filter(({ is_cleaning_norm }) => is_cleaning_norm);
  const isDt = missionList.some(({ route_type }) => route_type === routeTypesBySlug.dt.key);
  if (!isDt) {
    if (missionList.some(({ route_type }) => route_type === routeTypesBySlug.odh.key)) {
      type = 'odh';
    }
  } else {
    type = 'dt';
  }

  if (type) {
    const {
      time,
      title,
    } = routeTypesBySlug[type];

    if (diffDates(date_end, date_start, 'hours') > time) {
      global.NOTIFICATION_SYSTEM.notify(`Время выполнения задания для ${title} должно составлять не более ${time} часов`, 'error');
      return true;
    }
  }

  return false;
};
