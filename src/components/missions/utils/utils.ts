import createFio from 'utils/create-fio';
const positions = require('components/missions/utils/position.json');

const PermittedPosiotosNamesSet = new Set(
  positions.filter(({ canToPut }) => canToPut).map(({ namePosition }) => namePosition.toString().toLowerCase()),
);

export function getPermittetEmployeeForBrigade(employeesList) {
  return employeesList.reduce((opt, e) => {
    const {
      position_name,
    } = e;

    if (!!position_name && PermittedPosiotosNamesSet.has(position_name.toLowerCase())) {
      opt.push({
        value: e.id,
        label: createFio(e, true),
        company_structure_id: e.company_structure_id,
        active: e.active,
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

export const checkRouteByNew = (state, route) => {
  const { is_new = true } = state;

  if (is_new) {
    const {
      is_new: route_is_new,
    } = route;

    if (route_is_new) {
      return true;
    }
    return false;
  }
  return true;
};