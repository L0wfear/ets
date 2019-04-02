import { getTodayConductingInspectAutobase, getTodayCompletedInspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import memoizeOne from 'memoize-one';
import { get } from 'lodash';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { getTodayConductingInspectPgmBase, getTodayCompletedInspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';

export const getLastConductingInspectAutobase = memoizeOne(
  (registryList: OneRegistryData['list']) => {
    return getTodayConductingInspectAutobase(get(registryList, 'data.array', []));
  },
);

export const getLastCompletedInspectAutobase = memoizeOne(
  (registryList: OneRegistryData['list']) => {
    return getTodayCompletedInspectAutobase(get(registryList, 'data.array', []));
  },
);

export const getLastConductingInspectPgmBase = memoizeOne(
  (registryList: OneRegistryData['list']) => {
    return getTodayConductingInspectPgmBase(get(registryList, 'data.array', []));
  },
);

export const getLastCompletedInspectPgmBase = memoizeOne(
  (registryList: OneRegistryData['list']) => {
    return getTodayCompletedInspectPgmBase(get(registryList, 'data.array', []));
  },
);
