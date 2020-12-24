import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import CarpoolFormWrap from 'components/new/pages/nsi/geoobjects/pages/carpool/form/CarpoolFormWrap';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/geoobjects/pages/carpool/_config-data/registry-config';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';
import { monitoringPermissions } from 'components/new/pages/inspection/_config_data';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

type Props = {};

const CarpoolList: React.FC<Props> = React.memo(
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
        <CarpoolFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default CarpoolList;
