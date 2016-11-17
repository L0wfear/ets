import { Actions } from 'flummox';
import {
  ODHNormService,
  ODHNormDataSummerService,
  EfficiencyService,
  MeasureUnitService
} from 'api/Services';
import _ from 'lodash';

export default class ODHActions extends Actions {

  getODHNorm() {
    return ODHNormService.get().then(r => ({ result: r.result.rows }));
  }

  getMeasureUnits() {
    return MeasureUnitService.get();
  }

  updateODHNorm(formState) {
    const payload = _.clone(formState);
    return ODHNormService.path(formState.id).put(payload, true, 'json');
  }

  createODHNorm(formState) {
    const payload = _.clone(formState);
    // if (typeof payload.consumable_material === 'undefined') payload.consumable_material = false;
    return ODHNormService.post(payload, true, 'json');
  }

  deleteODHNorm(id) {
    return ODHNormService.path(id).delete({}, true, 'json');
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

  getEfficiency() {
    return EfficiencyService.get();
  }

  updateEfficiency(formState) {
    const payload = _.clone(formState);
    return EfficiencyService.path(formState.id).put(payload, true, 'json');
  }

  createEfficiency(formState) {
    const payload = _.clone(formState);
    return EfficiencyService.post(payload, true, 'json');
  }

  deleteEfficiency(formState) {
    return EfficiencyService.path(formState.id).delete();
  }


}
