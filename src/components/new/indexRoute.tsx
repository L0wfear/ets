import * as React from 'react';
import { Switch, Redirect, Route as PublicRoute } from 'react-router-dom';
import routerAndPermission from 'constants/routerAndPermission';
import { path } from 'components/new/pages/nsi/order/_config-data';

// TODO сделать модуль containers по аналогии с другими модулями

const renderRoutes = (newRoutesArr, data) => {
  if (!data.noRoute) {
    if (data.path) {
      if (data.children) {
        newRoutesArr.push(
          ...(Object.values(data.children) as any).reduce(renderRoutes, []),
        );
      } else {
        newRoutesArr.push(
          <PublicRoute
            key={data.entyity}
            path={data.routePath || data.path}
            component={data.component}
          />,
        );
      }
    } else if (!data.divider && !data.hiddenNav) {
      newRoutesArr.push(...(Object.values(data.children) as any).reduce(renderRoutes, []));
    }
  }

  return newRoutesArr;
};

const getRouters = () => (
  <Switch>
    { Object.values(routerAndPermission).reduce(renderRoutes, []) }

    { /* 32 релиз */}
    <Redirect from="/orders" to={path} />

    <Redirect to="/monitor" />
  </Switch>
);

export default getRouters;
