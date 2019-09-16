import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import {
  registryKey,
  config,
} from 'components/new/pages/missions/duty_mission_template/_config-data/registry-config';

import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import DutyMissionTemplateFormWrap from 'components/new/pages/missions/duty_mission_template/form/DutyMissionTemplateFormWrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const DutyMissionTemplateList: React.FC<{}> = React.memo(
  () => {
    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        dispatch(registryAddInitialData(config));

        return () => {
          dispatch(registryRemoveData(registryKey));
        };
      },
      [config],
    );

    return (
      <>
        <Registry registryKey={registryKey} />
        <DutyMissionTemplateFormWrap registryKey={registryKey} />
      </>
    );
  },
);

export default withPreloader({
  page: config.registryKey,
  typePreloader: 'mainpage',
})(DutyMissionTemplateList);
