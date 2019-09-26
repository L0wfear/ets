import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/duty_mission/_config-data/registry-config';

import DutyMissionListFormWrap from 'components/new/pages/missions/duty_mission/form/main/DutyMissionListFormWrap';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const DutyMissionList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <React.Fragment>
        <Registry registryKey={registryKey} />
        <DutyMissionListFormWrap registryKey={registryKey} />
      </React.Fragment>
    );
  },
);

export default withRegistry<DutyMission, OwnProps>(config)(DutyMissionList);
