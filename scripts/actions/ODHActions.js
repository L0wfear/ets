import { Actions } from 'flummox';
import { ODHSupportStandardsService, ODHSupportStandardsDataSummerService } from 'api/Services';
import _ from 'lodash';

export default class ODHActions extends Actions {

  getODHSupportStandards() {
    return ODHSupportStandardsService.get();
  }

  updateODHSupportStandard(formState) {
    const payload = _.clone(formState);
    return ODHSupportStandardsService.put(payload, true, 'json');
  }

  createODHSupportStandard(formState) {
    const payload = _.clone(formState);
    return ODHSupportStandardsService.post(payload, true, 'json');
  }

  getODHSupportStandardsDataSummer() {
    return ODHSupportStandardsDataSummerService.get();
  }

  deleteODHSupportStandardsDataSummer() {
    const payload = _.clone(formState);
    return ODHSupportStandardsDataSummerService.delete(payload, true, 'json');
  }

  updateODHSupportStandardDataSummer(formState) {
    const payload = _.clone(formState);
    return ODHSupportStandardsDataSummerService.put(payload, true, 'json');
  }

  createODHSupportStandardDataSummer(formState) {
    const payload = _.clone(formState);
    return ODHSupportStandardsDataSummerService.post(payload, true, 'json');
  }

}
