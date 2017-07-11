import { Actions } from 'flummox';
import { cloneDeep } from 'lodash';
import { AutoBase } from 'api/Services';
import AUTOBASE from '../constants/autobase.js';
import { createValidDate, createValidDateTime } from 'utils/dates';

export default class EmployeesActions extends Actions {

  async getAutobaseListByType(type) {
    const trueType = AUTOBASE[type];
    const payload = {};

    const response = await AutoBase.path(trueType).get(payload);

    return {
      type,
      data: response,
    };
  }

  async createBatteryReg(formState) {
    const payload = cloneDeep(formState);
    console.log(payload)
    /*
    const response = await AutoBase.path(AUTOBASE.btr).post(payload);
      return {
        type,
        data: response,
      };
      */
  }

  async updateBattareReg(formState) {
    const payload = cloneDeep(formState);
    console.log(payload);
    /*
      const response = await AutoBase.path(AUTOBASE.btr).post(payload);
      return {
        type,
        data: response,
      };
      */
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
}
