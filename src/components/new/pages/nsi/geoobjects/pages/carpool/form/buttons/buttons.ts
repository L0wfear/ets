import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';

export const ButtonUpdateMainCarpool = withRequirePermissionsNew({
  permissions: 'carpool.update',
})(EtsBootstrap.Button);
