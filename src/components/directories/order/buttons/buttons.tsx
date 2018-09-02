import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

export const ButtonReadOrder = withRequirePermissionsNew({
  permissions: 'faxogramm.read',
})(Button);

export const LinkToOrder = withRequirePermissionsNew({
  permissions: 'faxogramm.read',
})(Link);