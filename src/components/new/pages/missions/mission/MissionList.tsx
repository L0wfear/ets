import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import {
  registryKey,
  config,
} from 'components/new/pages/missions/mission/_config-data/registry-config';

import MissionListFormWrap from 'components/new/pages/missions/mission/form/main/MissionListFormWrap';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

type OwnProps = {};
const MissionList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <MissionListFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<Mission, OwnProps>(config)(MissionList);
