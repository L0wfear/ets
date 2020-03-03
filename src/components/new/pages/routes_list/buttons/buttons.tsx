import * as React from 'react';
import { Link } from 'react-router-dom';
import permissionsRoute from 'components/new/pages/routes_list/config-data/permissions';

import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

export const LinkToOpenRouteInfoForm = withRequirePermission<any>({
  permissions: permissionsRoute.read,
})((props: any) => (
  <div>
    <a className="pointer" onClick={props.openRouteInfoForm} >Подробнее...</a>
  </div>
));

export const LinkToRouteListPermitted = withRequirePermission<any>({
  permissions: permissionsRoute.read,
})(Link);
