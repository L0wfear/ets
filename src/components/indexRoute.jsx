import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

// TODO сделать модуль containers по аналогии с другими модулями
import WaybillJournal from 'components/waybill/WaybillJournal.jsx';
import RoutesList from 'components/route/RoutesList.jsx';
import MonitorPage from 'components/monitor/MonitorPage.jsx';
import DashboardPage from 'components/dashboard/DashboardPage.jsx';
import UserNotificationList from 'components/notifications/UserNotificationList';
import ProgramRegistryList from 'components/program_registry/ProgramRegistryList.jsx';
import CompanyStructure from 'components/company_structure/CompanyStructure.jsx';
import * as missions from 'components/missions';

import reportRoutes from 'components/reports/indexRoute';
import nsiRoutes from 'components/directories/indexRoute';

const getRouters = props => (
  <Switch>
    {[
      <Route path="/monitor" component={MonitorPage} />,
      <Route path="/dashboard" component={DashboardPage} />,
      <Route path="/waybill-journal" component={WaybillJournal} />,
      <Route path="/company-structure" component={CompanyStructure} />,
      <Route path="/routes-list" component={RoutesList} />,
      <Route path="/mission-journal" component={missions.missions} />,
      <Route path="/mission-templates-journal" component={missions.missionTemplates} />,
      <Route path="/duty-missions-journal" component={missions.dutyMissions} />,
      <Route path="/duty-mission-templates-journal" component={missions.dutyMissionTemplates} />,
      <Route path="/program-registry" component={ProgramRegistryList} />,
      <Route path="/notification-registry" component={UserNotificationList} />,
      ...reportRoutes(props),
      ...nsiRoutes(props),
      <Redirect push from="*" to="/monitor" />,
    ]}
  </Switch>
);

export default getRouters;
