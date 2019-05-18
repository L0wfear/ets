import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import MissionFormLazy from 'components/new/pages/missions/mission/form/main';

export const PermittedMissionFormLazy = withRequirePermissionsNew({
  permissions: 'mission.read',
})(MissionFormLazy);

export const ButtonCreateMission = withRequirePermissionsNew({
  permissions: 'mission.create',
})(EtsBootstrap.Button);

export const ButtenUpdateMission = withRequirePermissionsNew({
  permissions: 'mission.update',
})(EtsBootstrap.Button);

export const LinkToOpenMissionInfoForm = withRequirePermissionsNew({
  permissions: 'mission.read',
})((props) => (
  <div>
    <a className="pointer" onClick={props.openMissiomInfoForm} >Подробнее...</a>
  </div>
));
