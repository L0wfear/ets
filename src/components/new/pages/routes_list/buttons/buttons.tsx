import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { Link } from 'react-router-dom';
import permissionsRoute from 'components/new/pages/routes_list/config-data/permissions';

import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';

export const LinkToOpenRouteInfoForm = withRequirePermissionsNew({
  permissions: permissionsRoute.read,
})((props) => (
  <div>
    <a className="pointer" onClick={props.openRouteInfoForm} >Подробнее...</a>
  </div>
));

export const LinkToRouteListPermitted = withRequirePermissionsNew({
  permissions: permissionsRoute.read,
})(Link);

export const ButtonCreateRoute = withRequirePermissionsNew({
  permissions: permissionsRoute.create,
})(EtsBootstrap.Button);

export const ButtonUpdateRoute = withRequirePermissionsNew({
  permissions: permissionsRoute.update,
})(EtsBootstrap.Button);

export const ButtonDeleteRoute = withRequirePermissionsNew({
  permissions: permissionsRoute.delete,
})(EtsBootstrap.Button);
