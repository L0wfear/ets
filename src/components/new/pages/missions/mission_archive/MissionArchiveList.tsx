import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/mission_archive/_config-data/registry-config';

import MissionArchiveListFormWrap from 'components/new/pages/missions/mission_archive/form/main/MissionArchiveListFormWrap';

import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

type OwnProps = {};
const MissionArchiveList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <MissionArchiveListFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<Mission, OwnProps>(config)(MissionArchiveList);
