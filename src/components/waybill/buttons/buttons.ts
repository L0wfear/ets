import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';

export const ButtonCreateWaybill = withRequirePermissionsNew({
  permissions: waybillPermissions.create,
})(EtsBootstrap.Button);

export const ButtonUpdateWaybill = withRequirePermissionsNew({
  permissions: [waybillPermissions.update, waybillPermissions.departure_and_arrival_values],
})(EtsBootstrap.Button);
