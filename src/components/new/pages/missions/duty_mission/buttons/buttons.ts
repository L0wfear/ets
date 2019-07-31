import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';

export const ButtonCreateDutyMission = withRequirePermissionsNew({
  permissions: 'duty_mission.create',
})(EtsBootstrap.Button);

export const ButtonUpdateDutyMission = withRequirePermissionsNew({
  permissions: 'duty_mission.update',
})(EtsBootstrap.Button);
