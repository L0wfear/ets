import { Button } from 'react-bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

export const ButtenUpdateDutyMission = withRequirePermissionsNew({
  permissions: 'duty_mission.update',
})(Button);