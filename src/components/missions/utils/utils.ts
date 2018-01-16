import createFio from 'utils/create-fio.js';

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
}