import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import PgmStoreFormWrap from 'components/new/pages/nsi/geoobjects/pages/pgm_store/PgmStoreForm/PgmStoreFormWrap';
import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';
import { monitoringPermissions } from 'components/new/pages/inspection/_config_data/index';

type OwnProps = {};

const PgmStoreList: React.FC<OwnProps> = React.memo(
  () => {
    const dispatch = etsUseDispatch();
    const permissions = etsUseSelector((state) => getSessionState(state).userData.permissionsSet);
    const all = permissions.has(monitoringPermissions.all_inspaction) ? true : null;
    
    React.useEffect(
      () => {
        dispatch(registryAddInitialData(getToConfig(all)));
        return () => {
          dispatch(registryRemoveData(registryKey));
        };
      },
      [],
    );

    return (
      <Registry registryKey={registryKey}>
        <PgmStoreFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default PgmStoreList;
