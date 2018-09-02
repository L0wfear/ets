import { Button } from 'react-bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

export const ButtonCreateWaybill = withRequirePermissionsNew({
  permissions: 'waybill.create',
})(Button);

export const ButtonUpdateWaybill = withRequirePermissionsNew({
  permissions: 'waybill.update',
})(Button);