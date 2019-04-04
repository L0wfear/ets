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
            key={data.entyity}
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
    { /* 27 релиз */ }
    <Redirect from="/duty-mission-templates-journal" to="/missions/duty_mission_templates" />
    <Redirect from="/employees" to="/nsi/employees" />
    <Redirect from="/types-attr" to="/types_attr" />
    { /* 28 релиз */ }
    <Redirect from="/technical-operations" to="/nsi/norm_registry" />
    <Redirect from="/companies" to="/nsi/companies" />

    <Redirect from="/cars" to="/nsi/autobase/car_actual" />
    <Redirect from="/car-func-types" to="/nsi/autobase/types" />
    <Redirect from="/types_attr" to="/nsi/autobase/types_attr" />
    <Redirect from="/tech-inspection" to="/nsi/autobase/tech_inspection" />
    <Redirect from="/insurance-policy" to="/nsi/autobase/insurance_policy" />
    <Redirect from="/battery-brand" to="/nsi/autobase/battery_brand" />
    <Redirect from="/battery-manufacturer" to="/nsi/autobase/battery_manufacturer" />
    <Redirect from="/tire-model" to="/nsi/autobase/tire_model" />
    <Redirect from="/spare-part" to="/nsi/autobase/spare_part" />

    <Redirect from="/bridges" to="/nsi/geoobjects/bridges" />
    <Redirect from="/carpool" to="/nsi/geoobjects/carpool" />
    <Redirect from="/ssp" to="/nsi/geoobjects/ssp" />
    <Redirect from="/snow_storage" to="/nsi/geoobjects/snow_storage" />
    <Redirect from="/pgm_store" to="/nsi/geoobjects/pgm_store" />
    <Redirect from="/pedestrian_tunnels" to="/nsi/geoobjects/pedestrian_tunnels" />
    <Redirect from="/pedestrian_tunnel_exits" to="/nsi/geoobjects/pedestrian_tunnel_exits" />
    <Redirect from="/odh" to="/nsi/geoobjects/odh" />
    <Redirect from="/msp" to="/nsi/geoobjects/msp" />
    <Redirect from="/fueling-water" to="/nsi/geoobjects/fueling_water" />
    <Redirect from="/fountains" to="/nsi/geoobjects/fountains" />
    <Redirect from="/dt" to="/nsi/geoobjects/dt" />
    <Redirect from="/danger_zone" to="/nsi/geoobjects/danger_zone" />

    <Redirect to="/monitor" />
  </Switch>
);

export default getRouters;
