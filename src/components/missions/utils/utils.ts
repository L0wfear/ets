import createFio from 'utils/create-fio';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

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

export const isOrderSource = (
  (
    mission_source_id: DutyMission['mission_source_id'] | Mission['mission_source_id'],
    order_mission_source_id: number,
  ) => (
    mission_source_id === order_mission_source_id
  )
);
