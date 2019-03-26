import * as React from 'react';
import { Switch, Redirect, Route as PublicRoute } from 'react-router-dom';
import routerAndPermission from 'constants/routerAndPermission';

// TODO сделать модуль containers по аналогии с другими модулями

const renderRoutes = (newRoutesArr, data) => {
  if (!data.noRoute) {
    if (data.path) {
      if (data.children) {
        newRoutesArr.push(
          ...Object.values(data.children).reduce(renderRoutes, []),
        );
      } else {
        newRoutesArr.push(
          <PublicRoute
            key={data.routePath || data.path}
            path={data.routePath || data.path}
            component={data.component}
          />,
        );
      }
    } else if (!data.divider && !data.hiddenNav) {
      newRoutesArr.push(...Object.values(data.children).reduce(renderRoutes, []));
    }
  }

  return newRoutesArr;
};

const getRouters = () => (
  <Switch>
    { Object.values(routerAndPermission).reduce(renderRoutes, []) }
    <Redirect from="/duty-mission-templates-journal" to="/missions/duty_mission_templates" />
    <Redirect from="/employees" to="/nsi/employees" />
    <Redirect to="/monitor" />
  </Switch>
);

export default getRouters;
