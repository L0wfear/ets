import * as Button from 'react-bootstrap/lib/Button';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

export const ButtonUpdateMainCarpool = withRequirePermissionsNew({
  permissions: 'carpool.update',
})(Button);
