import createFio from 'utils/create-fio.js';
import { diffDates } from 'utils/dates.js';

// DutyMission
const PermittedPosiotosNames = [
  'дорожный рабочий',
  'дворник',
];

export function getPermittetEmployeeForBrigade(employeesList) {
  return employeesList.reduce((opt, e) => {
    const {
      position_name,
    } = e;

    if (!!position_name && PermittedPosiotosNames.includes(position_name.toLowerCase())) {
      opt.push({
        value: e.id,
        label: createFio(e, true),
        company_structure_id: e.company_structure_id,
      });
    }

    return opt;
  }, []);
}

export const getKindTaskIds = (id, fromOrder) => {
  if (!id) {
    if (fromOrder) {
      return '2,3';
    } else {
      return '3';
    }
  }
};

export const checkDateByRoyteType = (dates, routeType) => {
  const {
    date_start,
    date_end,
  } = dates;

  if (routeType === null) {
    return { error_date: false };
  } else {
    switch (routeType) {
      case 'dt': return {
        error_date: diffDates(date_end, date_start, 'minutes') > 4 * 60,
        type: 'ДТ',
        time: 4,
      };
      case 'odh': return {
        error_date: diffDates(date_end, date_start, 'minutes') > 5 * 60,
        type: 'ОДХ',
        time: 5,
      };
      default: throw new Error('Тип маршрута не определён');
    }
  }
}
