import * as React from 'react';

import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';

import MissionFormLazy from 'components/new/pages/missions/mission/form/main';

export const PermittedMissionFormLazy = withRequirePermissionsNew({
  permissions: 'mission.read',
})(MissionFormLazy);

export const LinkToOpenMissionInfoForm = withRequirePermissionsNew({
  permissions: 'mission.read',
})((props) => (
  <div>
    <a className="pointer" onClick={props.openMissiomInfoForm} >Подробнее...</a>
  </div>
));
