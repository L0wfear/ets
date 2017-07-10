import { Actions } from 'flummox';
import { AutoBase } from 'api/Services';
import AUTOBASE_CONSTANT from '../constants/autobase.js';
import { createValidDate, createValidDateTime } from 'utils/dates';
import _ from 'lodash';

export default class EmployeesActions extends Actions {

  async getAutobaseListByType(type) {
    const trueType = AUTOBASE_CONSTANT[type];
    const payload = {};

    const response = await AutoBase.path(trueType).get(payload);

    return {
      type,
      data: response,
    };
  }

  updateAutobaseListByType(type) {
    const trueType = AUTOBASE_CONSTANT[type];

    return async (formState) => {
      const payload = _.cloneDeep(formState);
      console.log(type, trueType, payload);
      /*
      const response = await AutoBase.path(trueType).post(payload);
      return {
        type,
        data: response,
      };
      */
    };
  }


}
