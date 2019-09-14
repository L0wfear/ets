import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import {
  registryKey,
  config,
} from 'components/new/pages/missions/mission/_config-data/registry-config';

import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import MissionListFormWrap from 'components/new/pages/missions/mission/form/main/MissionListFormWrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const MissionList: React.FC<{}> = React.memo(
  () => {
    const dispatch = etsUseDispatch();
    React.useEffect(
      () => {
        dispatch(registryAddInitialData(config));

        return () => {
          dispatch(registryRemoveData(registryKey));
        };
      },
      [],
    );

    return (
      <>
        <Registry registryKey={registryKey} />
        <MissionListFormWrap registryKey={registryKey} />
      </>
    );
  },
);

export default withPreloader({
  page: config.registryKey,
  typePreloader: 'mainpage',
})(MissionList);
