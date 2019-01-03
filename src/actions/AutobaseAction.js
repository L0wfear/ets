import { Actions } from 'flummox';
import { AutoBase } from 'api/Services';
import AUTOBASE from '../constants/autobase';

export default class AutobaseActions extends Actions {
  async getAutobaseListByType(type, data, other) {
    const trueType = AUTOBASE[type];
    const payload = {
      ...data,
    };

    const response = await AutoBase.path(trueType).get(payload);

    return {
      type,
      data: response,
      ...other,
    };
  }
}
