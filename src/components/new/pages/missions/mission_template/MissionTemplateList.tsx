import * as React from 'react';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  config,
} from 'components/new/pages/missions/mission_template/_config-data/registry-config';

import MissionTemplateFormWrap from 'components/new/pages/missions/mission_template/form/MissionTemplateFormWrap';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import withRegistry from 'components/new/ui/registry/hoc/withRegistry';

type OwnProps = {};
const MissionTemplateList: React.FC<OwnProps> = React.memo(
  () => {
    return (
      <Registry registryKey={registryKey}>
        <MissionTemplateFormWrap registryKey={registryKey} />
      </Registry>
    );
  },
);

export default withRegistry<MissionTemplate, OwnProps>(config)(MissionTemplateList);
