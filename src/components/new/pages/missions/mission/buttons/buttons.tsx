import * as React from 'react';

import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

import MissionFormLazy from 'components/new/pages/missions/mission/form/main';

export const PermittedMissionFormLazy = withRequirePermission<any>({
  permissions: 'mission.read',
})(MissionFormLazy as any);

export const LinkToOpenMissionInfoForm = withRequirePermission<any>({
  permissions: 'mission.read',
})((props: any) => (
  <div>
    <a className="pointer" onClick={props.openMissiomInfoForm} >Подробнее...</a>
  </div>
));
