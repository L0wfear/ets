import { getTodayConductingInspect, getTodayCompletedInspect } from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import memoizeOne from 'memoize-one';
import { get } from 'lodash';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

export const getLastConductingInspect = memoizeOne(
  (registryList: OneRegistryData['list']) => {
    return getTodayConductingInspect(get(registryList, 'data.array', []));
  },
);

export const geLastCompletedInspect = memoizeOne(
  (registryList: OneRegistryData['list']) => {
    return getTodayCompletedInspect(get(registryList, 'data.array', []));
  },
);
