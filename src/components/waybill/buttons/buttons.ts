import { Button } from 'react-bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import permissions from 'components/waybill/config-data/permissions';

export const ButtonCreateWaybill = withRequirePermissionsNew({
  permissions: permissions.create,
})(Button);

export const ButtonUpdateWaybill = withRequirePermissionsNew({
  permissions: [permissions.update, permissions.departure_and_arrival_values],
})(Button);
