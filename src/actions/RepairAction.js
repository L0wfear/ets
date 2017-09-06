import { Actions } from 'flummox';
import { Repair } from 'api/Services';
import REPAIR from '../constants/repair';

const parsePutPath = (entity, method, formState, idKey = 'id') => `${entity}/${method === 'put' ? formState[idKey] : ''}`;
export default class RepairActions extends Actions {

  async getRepairListByType(type, data) {
    const trueType = REPAIR[type];
    const payload = {
      ...data,
    };

    const response = await Repair.path(trueType).get(payload);

    return {
      type,
      data: response,
    };
  }

  // DITETS-1795
  contractor(method, formState) {
    const payload = {
      ...formState,
    };
    const { contractor } = REPAIR;

    const path = parsePutPath(contractor, method, formState);

    return Repair.path(path)[method](
      payload,
      this.getRepairListByType.bind(null, 'contractor'),
      'json',
    );
  }
  removeСontractor(id) {
    const { contractor } = REPAIR;
    return Repair.path(`${contractor}/${id}`).delete(
      {},
      this.getRepairListByType.bind(null, 'contractor'),
      'json',
    );
  }

  // DITETS-1019
  stateProgram(method, formState) {
    const payload = {
      ...formState,
    };
    const { stateProgram } = REPAIR;

    const path = parsePutPath(stateProgram, method, formState);

    return Repair.path(path)[method](
      payload,
      this.getRepairListByType.bind(null, 'stateProgram'),
      'json',
    );
  }
  removeStateProgram(id) {
    const { stateProgram } = REPAIR;
    return Repair.path(`${stateProgram}/${id}`).delete(
      {},
      this.getRepairListByType.bind(null, 'stateProgram'),
      'json',
    );
  }

}
