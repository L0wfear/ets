import createFio from 'utils/create-fio';
const positions = require('components/missions/utils/position.json');

const PermittedPosiotosNamesSet = new Set(
  positions.filter(({ canToPut }) => canToPut).map(({ namePosition }) => namePosition.toString().toLowerCase()),
);

export function getPermittetEmployeeForBrigade(employeesList, structure_id) {
  return employeesList.reduce((opt, e) => {
    const {
      position_name,
    } = e;

    if (!!position_name && PermittedPosiotosNamesSet.has(position_name.toLowerCase()) && e.active && (!structure_id || (e.company_structure_id === structure_id))) {
      opt.push({
        value: e.id,
        label: createFio(e, true),
        active: true,
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
