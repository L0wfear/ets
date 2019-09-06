import * as React from 'react';
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
