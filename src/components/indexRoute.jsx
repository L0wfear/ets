import React from 'react';
import { withProps } from 'recompose';
import { Router, Route, Redirect } from 'react-router';
import { createHashHistory } from 'history';

// TODO сделать модуль containers по аналогии с другими модулями
import LoginPage from 'components/login/LoginPage.jsx';
import WaybillJournal from 'components/waybill/WaybillJournal.jsx';
import RoutesList from 'components/route/RoutesList.jsx';
import MonitorPageNew from 'components/monitor/new/MonitorPage';
import MonitorPage from 'components/monitor/MonitorPage';
import DashboardPage from 'components/dashboard/DashboardPage.jsx';
import DashboardPageNew from 'components/dashboard/new/DashboardPage';
import UserNotificationList from 'components/notifications/UserNotificationList';
import CompanyStructure from 'components/company_structure/CompanyStructure.jsx';
import ProgramRegistryList from 'components/program_registry/ProgramRegistryList.jsx';
import * as missions from 'components/missions';
import CahngeCompany from 'components/nav-item-role/CahngeCompany';
import AppComponent from 'components/App';
import {
  requireAuth as _requireAuth,
  requireAuthWithGlav as _requireAuthWithGlav,
  checkLoggedIn as _checkLoggedIn,
} from 'utils/auth';

import reportRoutes from 'components/reports/indexRoute';
import nsiRoutes from 'components/directories/indexRoute';

const history = createHashHistory({ queryKey: false });

const routes = (props) => {
  const { flux } = props;
  const requireAuth = _requireAuth(flux);
  const requireAuthWithGlav = _requireAuthWithGlav(flux);
  const checkLoggedIn = _checkLoggedIn(flux);
  const App = withProps({ flux })(AppComponent);

  return (
    <Router history={history}>
      <Redirect from="/" to="monitor" />
      <Route path="/" component={App}>
        <Route path="change-company" component={CahngeCompany} onEnter={requireAuthWithGlav} />
        <Route path="monitor" component={MonitorPage} onEnter={requireAuth} />
        <Route path="monitor-new" component={MonitorPageNew} onEnter={requireAuth} />
        <Route path="dashboard" component={DashboardPage} onEnter={requireAuth} />
        <Route path="dashboard-new" component={DashboardPageNew} onEnter={requireAuth} />
        <Route path="waybill-journal" component={WaybillJournal} onEnter={requireAuth} />
        <Route path="company-structure" component={CompanyStructure} onEnter={requireAuth} />
        <Route path="routes-list" component={RoutesList} onEnter={requireAuth} />
        {/* Задания */}
        <Route path="mission-journal" component={missions.missions} onEnter={requireAuth} />
        <Route path="mission-templates-journal" component={missions.missionTemplates} onEnter={requireAuth} />
        <Route path="duty-missions-journal" component={missions.dutyMissions} onEnter={requireAuth} />
        <Route path="duty-mission-templates-journal" component={missions.dutyMissionTemplates} onEnter={requireAuth} />
        <Route path="/program-registry" component={ProgramRegistryList} />,
        {/* Отчёты */}
        {reportRoutes({ requireAuth })}
        {/* НСИ - Реестры и справочники */}
        {nsiRoutes({ requireAuth })}
        <Route path="notification-registry" component={UserNotificationList} onEnter={requireAuth} />
        {/* Страница логина */}
        <Route path="login" component={LoginPage} onEnter={checkLoggedIn} />
        <Redirect from="*" to="monitor" />
      </Route>
    </Router>
  );
};

routes.propTypes = {
  flux: React.PropTypes.shape({}),
};

export default routes;
