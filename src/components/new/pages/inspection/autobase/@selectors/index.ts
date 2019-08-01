import memoizeOne from 'memoize-one';
import { get } from 'lodash';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { getTodayCompletedInspect, getTodayConductingInspect } from 'redux-main/reducers/modules/inspect/inspect_utils';

export const getLastConductingInspect = memoizeOne(
  (registryList: OneRegistryData['list']) => {
    return getTodayConductingInspect(get(registryList, 'data.array', []));
  },
);

export const getLastCompletedInspect = memoizeOne(
  (registryList: OneRegistryData['list']) => {
    return getTodayCompletedInspect(get(registryList, 'data.array', []));
  },
);
