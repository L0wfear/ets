import * as React from 'react';

import { withRequirePermission, WithRequirePermissionProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

import MissionFormLazy, { OwnMissionFormProps } from 'components/new/pages/missions/mission/form/main';

export const PermittedMissionFormLazy = withRequirePermission<OwnMissionFormProps & WithRequirePermissionProps>({
  permissions: 'mission.read',
})(MissionFormLazy as any);

export const LinkToOpenMissionInfoForm = withRequirePermission<any>({
  permissions: 'mission.read',
})((props: any) => (
  <div>
    <a className="pointer" onClick={props.openMissiomInfoForm} >Подробнее...</a>
  </div>
));
