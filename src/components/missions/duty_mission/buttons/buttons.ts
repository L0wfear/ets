import { Button } from 'react-bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

export const ButtonCreateDutyMission = withRequirePermissionsNew({
  permissions: 'duty_mission.create',
})(Button);

export const ButtonUpdateDutyMission = withRequirePermissionsNew({
  permissions: 'duty_mission.update',
})(Button);