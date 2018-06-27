import * as React from 'react';
import { Switch, Redirect, Route as PublicRoute } from 'react-router-dom';
import routerAndPermission from 'constants/routerAndPermission';

// TODO сделать модуль containers по аналогии с другими модулями

const renderRoutes = (newRoutesArr, data) => {
  if (!data.noRoute) {
    if (data.path) {
      newRoutesArr.push(
        ...data.components.map(componentData =>
          <PublicRoute
            key={[data.path, componentData.addPath].join('')}
            path={[data.path, componentData.addPath].join('')}
            exact={componentData.exact}
            component={componentData.component}
          />
        ),
      );
    } else if (!data.divider && !data.hiddenNav) {
      newRoutesArr.push(...Object.values(data.children).reduce(renderRoutes, []));
    }
  }
      
  return newRoutesArr;
};

const getRouters = () => (
  <Switch>
    { Object.values(routerAndPermission).reduce(renderRoutes, []) }
    <Redirect push from="*" to="/monitor" />
  </Switch>
);

export default getRouters;
