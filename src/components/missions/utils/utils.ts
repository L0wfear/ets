import createFio from 'utils/create-fio';

export function getPermittetEmployeeForBrigade(employeesList, structure_id) {
  return employeesList.reduce((opt, e) => {
    const {
      position_name,
      can_duty_mission,
    } = e;

    if (!!position_name && can_duty_mission && e.active && (!structure_id || !e.company_structure_id || (e.company_structure_id === structure_id))) {
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
