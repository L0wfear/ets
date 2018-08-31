import * as React from 'react';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

export const LinkToOpenRouteInfoForm: React.SFC<any> = withRequirePermissionsNew({
  permissions: 'route.read',
})(props => (
  <div>
    <a className="pointer" onClick={props.openRouteInfoForm} >Подробнее...</a>
  </div>
));