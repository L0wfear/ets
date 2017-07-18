import { Actions } from 'flummox';
import { cloneDeep } from 'lodash';
import { AutoBase } from 'api/Services';
import AUTOBASE from '../constants/autobase.js';
import { createValidDate } from 'utils/dates';

export default class EmployeesActions extends Actions {

  async getAutobaseListByType(type) {
    const trueType = AUTOBASE[type];

    const response = await AutoBase.path(trueType).get();

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

  removeBattery(id) {
    const payload = { id };
    return AutoBase.path(AUTOBASE.btr).delete(payload, false, 'json');
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
