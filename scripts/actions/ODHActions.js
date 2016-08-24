import { Actions } from 'flummox';
import { ODHSupportStandardsService } from 'api/Services';
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

}
