import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import MissionFormLazy from 'components/new/pages/missions/mission/form/main';

export const PermittedMissionFormLazy = withRequirePermissionsNew({
  permissions: 'mission.read',
})(MissionFormLazy);

export const ButtonCreateMission = withRequirePermissionsNew({
  permissions: 'mission.create',
})(Button);

export const ButtenUpdateMission = withRequirePermissionsNew({
  permissions: 'mission.update',
})(Button);

export const LinkToOpenMissionInfoForm = withRequirePermissionsNew({
  permissions: 'mission.read',
})((props) => (
  <div>
    <a className="pointer" onClick={props.openMissiomInfoForm} >Подробнее...</a>
  </div>
));
