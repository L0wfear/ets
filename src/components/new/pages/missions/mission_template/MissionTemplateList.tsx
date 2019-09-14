import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/mission_template/_config-data/registry-config';

import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import MissionTemplateFormWrap from 'components/new/pages/missions/mission_template/form/MissionTemplateFormWrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const MissionTemplateList: React.FC<{}> = React.memo(
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
        <MissionTemplateFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withPreloader({
  page: config.registryKey,
  typePreloader: 'mainpage',
})(MissionTemplateList);
