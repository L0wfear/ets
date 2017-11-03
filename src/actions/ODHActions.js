import { Actions } from 'flummox';
import {
  ODHNormService,
  ODHNormDataSummerService,
  EfficiencyService,
  MeasureUnitService,
} from 'api/Services';
import { clone } from 'lodash';

function getODHNorm() {
  return ODHNormService.get().then(r => ({ result: r.result.rows }));
}

export default class ODHActions extends Actions {

  getODHNorm() {
    return getODHNorm();
  }

  updateODHNorm(formState) {
    const payload = clone(formState);
    return ODHNormService.path(formState.id).put(payload, getODHNorm, 'json');
  }

  createODHNorm(formState) {
    const payload = clone(formState);
    // if (typeof payload.consumable_material === 'undefined') payload.consumable_material = false;
    return ODHNormService.post(payload, getODHNorm, 'json');
  }

  deleteODHNorm(id) {
    return ODHNormService.path(id).delete({}, getODHNorm, 'json');
  }

  getODHNormDataSummer() {
    return ODHNormDataSummerService.get();
  }

  updateODHNormDataSummer(formState) {
    const payload = clone(formState);
    return ODHNormDataSummerService.put(payload, true, 'json');
  }

  createODHNormDataSummer(formState) {
    const payload = clone(formState);
    return ODHNormDataSummerService.post(payload, true, 'json');
  }

  getMeasureUnits() {
    return MeasureUnitService.get();
  }

  getEfficiency() {
    return EfficiencyService.get();
  }

  updateEfficiency(formState) {
    const payload = clone(formState);
    return EfficiencyService.path(formState.id).put(payload, true, 'json');
  }

  createEfficiency(formState) {
    const payload = clone(formState);
    return EfficiencyService.post(payload, true, 'json');
  }

  deleteEfficiency(formState) {
    return EfficiencyService.path(formState.id).delete();
  }


}
