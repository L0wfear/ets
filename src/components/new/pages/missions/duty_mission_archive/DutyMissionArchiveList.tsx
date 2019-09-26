import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/duty_mission_archive/_config-data/registry-config';

import DutyMissionArchiveListFormWrap from 'components/new/pages/missions/duty_mission_archive/form/main/DutyMissionArchiveListFormWrap';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

type OwnProps = {};
const DutyMissionArchiveList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <DutyMissionArchiveListFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<DutyMission, OwnProps>(config)(DutyMissionArchiveList);
