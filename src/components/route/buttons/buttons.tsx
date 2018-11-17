import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router-dom';
import permissionsRoute from 'components/route/config-data/permissions';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

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
})(Button);

export const ButtonUpdateRoute = withRequirePermissionsNew({
  permissions: permissionsRoute.update,
})(Button);

export const ButtonDeleteRoute = withRequirePermissionsNew({
  permissions: permissionsRoute.delete,
})(Button);
