import * as React from 'react';
import { Button } from 'react-bootstrap';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import MissionFormWrap from 'components/missions/mission/MissionFormWrap';

export const PermittedMissionFormWrap = withRequirePermissionsNew({
  permissions: 'mission.read',
})(MissionFormWrap);

export const ButtonCreateMission = withRequirePermissionsNew({
  permissions: 'mission.create',
})(Button);

export const ButtenUpdateMission = withRequirePermissionsNew({
  permissions: 'mission.update',
})(Button);

export const LinkToOpenMissionInfoForm: React.SFC<any> = withRequirePermissionsNew({
  permissions: 'mission.read',
})(props => (
  <div>
    <a className="pointer" onClick={props.openMissiomInfoForm} >Подробнее...</a>
  </div>
));