import React from 'react';
import { withProps } from 'recompose';
import { Router, Route, Redirect } from 'react-router';
import { createHashHistory } from 'history';

// TODO сделать модуль containers по аналогии с другими модулями
import LoginPage from 'components/login/LoginPage.jsx';
import WaybillJournal from 'components/waybill/WaybillJournal.jsx';
import RoutesList from 'components/route/RoutesList.jsx';
import MonitorPage from 'components/monitor/MonitorPage.jsx';
import DashboardPage from 'components/dashboard/DashboardPage.jsx';
import CompanyStructure from 'components/company_structure/CompanyStructure.jsx';
import * as missions from 'components/missions';
import * as directories from 'components/directories';

import AppComponent from 'components/App';
import {
  requireAuth as _requireAuth,
  checkLoggedIn as _checkLoggedIn,
} from 'utils/auth';

import { reportRoutes } from 'components/reports/indexRoute';

const history = createHashHistory({ queryKey: false });

const routes = (props) => {
  const { flux } = props;
  const requireAuth = _requireAuth(flux);
  const checkLoggedIn = _checkLoggedIn(flux);
  const App = withProps({ flux })(AppComponent);

  return (
    <Router history={history}>
      <Redirect from="/" to="monitor" />
      <Route path="/" component={App}>
        <Route path="monitor" component={MonitorPage} onEnter={requireAuth} />
        <Route path="dashboard" component={DashboardPage} onEnter={requireAuth} />
        <Route path="waybill-journal" component={WaybillJournal} onEnter={requireAuth} />
        <Route path="company-structure" component={CompanyStructure} onEnter={requireAuth} />
        <Route path="routes-list" component={RoutesList} onEnter={requireAuth} />
        {/* Задания */}
        <Route path="mission-journal" component={missions.missions} onEnter={requireAuth} />
        <Route path="mission-templates-journal" component={missions.missionTemplates} onEnter={requireAuth} />
        <Route path="duty-missions-journal" component={missions.dutyMissions} onEnter={requireAuth} />
        <Route path="duty-mission-templates-journal" component={missions.dutyMissionTemplates} onEnter={requireAuth} />
        {reportRoutes({ requireAuth })}
        {/* НСИ - Реестры и справочники */}
        <Route path="employees" component={directories.employees} onEnter={requireAuth} />
        <Route path="faxogramms" component={directories.faxogramm} onEnter={requireAuth} />
        <Route path="fuel-rates" component={directories.fuelRates} onEnter={requireAuth} />
        <Route path="fuel-operations" component={directories.fuelOperations} onEnter={requireAuth} />
        <Route path="organizations" component={directories.organizations} onEnter={requireAuth} />
        <Route path="technical-operations" component={directories.technicalOperations} onEnter={requireAuth} />
        <Route path="car-func-types" component={directories.carTypes} onEnter={requireAuth} />
        <Route path="cars" component={directories.cars} onEnter={requireAuth} />
        <Route path="odh-norm" component={directories.odhNorm} onEnter={requireAuth} />
        <Route path="material-consumption-rate" component={directories.materialConsumptionRate} onEnter={requireAuth} />
        <Route path="odh-norm-data-summer" component={directories.odhNormDataSummer} onEnter={requireAuth} />
        <Route path="efficiency" component={directories.efficiency} onEnter={requireAuth} />
        <Route path="maintenance-work" component={directories.maintenanceWork} onEnter={requireAuth} />
        <Route path="cleaning-rate" component={directories.cleaningRate} onEnter={requireAuth} />
        <Route path="maintenance-rate" component={directories.maintenanceRate} onEnter={requireAuth} />
        <Route path="user-action-log" component={directories.userActionLog} onEnter={requireAuth} />
        {/* НСИ - Реестры и справочники - Геоинструментарий */}
        <Route path="odh" component={directories.geoobjects.odh} onEnter={requireAuth} />
        <Route path="dt" component={directories.geoobjects.dt} onEnter={requireAuth} />
        <Route path="ssp" component={directories.geoobjects.ssp} onEnter={requireAuth} />
        <Route path="msp" component={directories.geoobjects.msp} onEnter={requireAuth} />
        <Route path="pgm" component={directories.geoobjects.pgm} onEnter={requireAuth} />
        <Route path="snow-storage" component={directories.geoobjects.snowStorage} onEnter={requireAuth} />
        <Route path="fueling-water" component={directories.geoobjects.fuelingWater} onEnter={requireAuth} />
        <Route path="carpool" component={directories.geoobjects.carpool} onEnter={requireAuth} />
        <Route path="danger-zones" component={directories.geoobjects.dangerZones} onEnter={requireAuth} />
        {/* Страница логина */}
        <Route path="login" component={LoginPage} onEnter={checkLoggedIn} />
      </Route>
    </Router>
  );
};

routes.propTypes = {
  flux: React.PropTypes.shape({}),
};

export {
  routes,
};
