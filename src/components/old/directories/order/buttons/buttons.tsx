import EtsBootstrap from 'components/new/ui/@bootstrap';
import { Link } from 'react-router-dom';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

export const ButtonReadOrder = withRequirePermissionsNew({
  permissions: 'faxogramm.read',
})(EtsBootstrap.Button);

export const LinkToOrder = withRequirePermissionsNew({
  permissions: 'faxogramm.read',
})(Link);
