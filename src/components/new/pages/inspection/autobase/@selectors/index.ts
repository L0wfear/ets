import memoizeOne from 'memoize-one';
import { get } from 'lodash';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { getTodayCompletedInspect, getTodayConductingInspect } from 'redux-main/reducers/modules/inspect/inspect_utils';
import { DefaultPartInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';

export const getLastConductingInspect = memoizeOne(
  (registryList: OneRegistryData['list']) => {
    return getTodayConductingInspect(get(registryList, 'data.array', []));
  },
);

export const getLastCompletedInspect = memoizeOne(
  <T extends DefaultPartInspect>(registryList: OneRegistryData['list']) => {
    return getTodayCompletedInspect(get(registryList, 'data.array', []));
  },
);
