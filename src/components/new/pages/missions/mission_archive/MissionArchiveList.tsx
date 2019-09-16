import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/mission_archive/_config-data/registry-config';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import MissionArchiveListFormWrap from 'components/new/pages/missions/mission_archive/form/main/MissionArchiveListFormWrap';

import { registryAddInitialData, registryRemoveData } from "components/new/ui/registry/module/actions-registy";
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const MissionArchiveList: React.FC<{}> = React.memo(
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
        <MissionArchiveListFormWrap registryKey={registryKey} />
      </>
    );
  },
);

export default withPreloader({
  page: config.registryKey,
  typePreloader: 'mainpage',
})(MissionArchiveList);
