import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/duty_mission/_config-data/registry-config';

import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

import DutyMissionListFormWrap from 'components/new/pages/missions/duty_mission/form/main/DutyMissionListFormWrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const DutyMissionList: React.FC<{}> = React.memo(
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
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <DutyMissionListFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withPreloader({
  page: config.registryKey,
  typePreloader: 'mainpage',
})(DutyMissionList);
