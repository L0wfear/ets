import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';
import {
  registryKey,
  config,
} from 'components/new/pages/missions/duty_mission_template/_config-data/registry-config';

import DutyMissionTemplateFormWrap from 'components/new/pages/missions/duty_mission_template/form/DutyMissionTemplateFormWrap';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const DutyMissionTemplateList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <DutyMissionTemplateFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<DutyMissionTemplate, OwnProps>(config)(DutyMissionTemplateList);
