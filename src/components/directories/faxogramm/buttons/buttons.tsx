import { Button } from 'react-bootstrap';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

export const ButtonReadFaxogramm = withRequirePermissionsNew({
  permissions: 'faxogramm.read',
})(Button);