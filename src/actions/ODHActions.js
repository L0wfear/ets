import { Actions } from 'flummox';
import {
  ConsumableMaterialService,
  ODHNormDataSummerService,
  EfficiencyService,
} from 'api/Services';
import { clone } from 'lodash';

function getODHNorm() {
  return ConsumableMaterialService.get().then((r) => ({
    result: r.result.rows,
  }));
}

export default class ODHActions extends Actions {
  getODHNorm() {
    return getODHNorm();
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
