import { Actions } from 'flummox';
import { cloneDeep, get, omit } from 'lodash';
import { AutoBase } from 'api/Services';
import AUTOBASE from '../constants/autobase.js';
import { createValidDate } from 'utils/dates';

const parsePutPath = (entity, method, formState, idKey = 'id') => `${entity}/${method === 'put' ? formState[idKey] : ''}`;
const clearPayload = state => omit(state, ['rowNumber', 'isHighlighted', 'isSelected']);

export default class EmployeesActions extends Actions {

  async getAutobaseListByType(type, payload) {
    const trueType = AUTOBASE[type];

    const response = await AutoBase.path(trueType).get(payload);

    return {
      type,
      data: response,
    };
  }

  batteryReg(method, formState) {
    let { btr } = AUTOBASE;

    const payload = cloneDeep(formState);

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key];
    });

    ['released_at', 'installed_at', 'uninstalled_at'].forEach((key) => {
      if (!!payload[key]) {
        payload[key] = createValidDate(payload[key]);
      } else {
        delete payload[key];
      }
    });

    if (method == 'put') {
      btr += `/${formState.id}`;
      // TODO исправить, когда появится таблица //uoiasfy
      // payload.battery_to_car = [];
    }

    return AutoBase.path(btr)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'btr'),
      'json',
    );
  }

  async getSparePartGroup() {
    const payload = {};

    const response = await AutoBase.path('spare_part_group').get(payload);

    return response.result.rows || [];
  }

  async getSparePartMeasureUnit() {
    const payload = {};

    const response = await AutoBase.path('measure_unit').get(payload);

    return response.result.rows || [];
  }

  sparePart(method, formState) {
    const payload = cloneDeep(formState);
    const { sparePart } = AUTOBASE;

    return AutoBase.path(sparePart)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'sparePart'),
      'json',
    );
  }

  tire(method, formState) {
    const cleanFormState = clearPayload(formState);

    const payload = {
      ...cleanFormState,
      tire_to_car: get(cleanFormState, 'tire_to_car', []).map(item => ({
        ...clearPayload(item),
        installed_at: createValidDate(item.installed_at),
        uninstalled_at: createValidDate(item.uninstalled_at),
      })),
    };
    const { tire } = AUTOBASE;
    const path = parsePutPath(tire, method, cleanFormState);

    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'tire'),
      'json',
    );
  }
  removeTire(id) {
    const { tire } = AUTOBASE;
    return AutoBase.path(`${tire}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'tire'),
      'json',
    );
  }
  cloneTire(id) {
    const { tire } = AUTOBASE;
    return AutoBase.path(`${tire}/${id}/copy`).post(
      {},
      this.getAutobaseListByType.bind(null, 'tire'),
      'json',
    );
  }
  batteryBrand(method, formState) {
    const payload = cloneDeep(formState);
    const { batteryBrand } = AUTOBASE;

    return AutoBase.path(batteryBrand)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'batteryBrand'),
      'json',
    );
  }

  batteryManufacturer(method, formState) {
    const payload = cloneDeep(formState);
    const { batteryManufacturer } = AUTOBASE;

    return AutoBase.path(batteryManufacturer)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'batteryManufacturer'),
      'json',
    );
  }

  deleteLineFromSarePart(formState) {
    const payload = { id: formState };
    const type = 'sparePart';

    const trueType = AUTOBASE[type];

    return AutoBase.path(trueType).delete(
      payload,
      this.getAutobaseListByType.bind(null, type),
      'json',
    );
  }
}
