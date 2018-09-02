import { Button } from 'react-bootstrap';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import MissionFormWrap from 'components/missions/mission/MissionFormWrap';

export const PermittedMissionFormWrap = withRequirePermissionsNew({
  permissions: 'mission.read',
})(MissionFormWrap);

export const ButtonCreateMission = withRequirePermissionsNew({
  permissions: 'mission.create',
})(Button);