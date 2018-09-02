import * as React from 'react';
import { Link } from 'react-router';

import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

export const LinkToOpenRouteInfoForm: React.SFC<any> = withRequirePermissionsNew({
  permissions: 'route.read',
})(props => (
  <div>
    <a className="pointer" onClick={props.openRouteInfoForm} >Подробнее...</a>
  </div>
));

export const LinkToRouteListPermitted = withRequirePermissionsNew({
  permissions: 'route.list',
})(Link);
