import { Actions } from 'flummox';
import { ODHNormService, ODHNormDataSummerService } from 'api/Services';
import _ from 'lodash';

export default class ODHActions extends Actions {

  getODHNorm() {
    return ODHNormService.get();
  }

  updateODHNorm(formState) {
    const payload = _.clone(formState);
    return ODHNormService.path(formState.id).put(payload, true, 'json');
  }

  createODHNorm(formState) {
    const payload = _.clone(formState);
    return ODHNormService.post(payload, true, 'json');
  }

  deleteODHNorm(formState) {
    return ODHNormService.path(formState.id).delete();
  }

  getODHNormDataSummer() {
    return ODHNormDataSummerService.get();
  }

  deleteODHNormDataSummer() {
    const payload = _.clone(formState);
    return ODHNormDataSummerService.delete(payload, true, 'json');
  }

  updateODHNormDataSummer(formState) {
    const payload = _.clone(formState);
    return ODHNormDataSummerService.put(payload, true, 'json');
  }

  createODHNormDataSummer(formState) {
    const payload = _.clone(formState);
    return ODHNormDataSummerService.post(payload, true, 'json');
  }

}
