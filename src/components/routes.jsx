import React from 'react';
import { Router, Route, Redirect } from 'react-router';
import { createHashHistory } from 'history';

import App from './../components/App';
import { requireAuth, checkLoggedIn } from './../utils/auth.js';
// TODO сделать модуль containers по аналогии с другими модулями
import LoginPage from './login/LoginPage.jsx';
import WaybillJournal from './waybill/WaybillJournal.jsx';
import RoutesList from './route/RoutesList.jsx';
import MonitorPage from './monitor/MonitorPage.jsx';
import DashboardPage from './dashboard/DashboardPage.jsx';
import CompanyStructure from './company_structure/CompanyStructure.jsx';
import * as missions from './missions';
import * as directories from './directories';
import * as reports from './reports';

const history = createHashHistory({ queryKey: false });

const reportRoutes = (
  <div>
    <Route path="odh-reports" component={reports.odh} onEnter={requireAuth} />
    <Route path="route-reports" component={reports.route.all} onEnter={requireAuth} />
    <Route path="route-report/:id" component={reports.route.single} onEnter={requireAuth} />
    <Route path="coverage-report" component={reports.coverage} onEnter={requireAuth} />
    <Route path="fuel-consumption-report" component={reports.fuelConsumption} onEnter={requireAuth} />
    <Route path="analytics" component={reports.analytics} onEnter={requireAuth} />
    <Route path="car_func_type_usage_reports" component={reports.carFuncTypeUsage.all} onEnter={requireAuth} />
    <Route path="car_func_type_usage_report" component={reports.carFuncTypeUsage.single} onEnter={requireAuth} />
    <Route path="track-events-reports" component={reports.trackEvents.all} onEnter={requireAuth} />
    <Route path="track-events-report/:date_start/:date_end/:company_id/:event_type" component={reports.trackEvents.single} onEnter={requireAuth} />
    <Redirect from="brigade-efficiency-report" to="brigade-efficiency-report/level/1" />
    <Route path="brigade-efficiency-report/level/1" component={reports.brigadeEfficiency.firstLevel} onEnter={requireAuth}>
      <Route path="/level/2" component={reports.brigadeEfficiency.secondLevel} onEnter={requireAuth} />
    </Route>
    <Route path="employee-efficiency-reports" component={reports.employeeEfficiency.all} onEnter={requireAuth} />
    <Route path="daily-cleaning-reports-ets" component={reports.daily.cleaning.ets.all} onEnter={requireAuth} />
    <Route path="daily-cleaning-report-ets/:element/:id" component={reports.daily.cleaning.ets.single} onEnter={requireAuth} />
    <Route path="daily-cleaning-reports-cafap" component={reports.daily.cleaning.cafap.all} onEnter={requireAuth} />
    <Route path="daily-cleaning-report-cafap/:element/:id" component={reports.daily.cleaning.cafap.single} onEnter={requireAuth} />
    <Route path="weekly-technical-operation-complete-reports" component={reports.weekly.technicalOperationComplete.all} onEnter={requireAuth} />
    <Route path="weekly-technical-operation-complete-report/:element/:id" component={reports.weekly.technicalOperationComplete.single} onEnter={requireAuth} />
  </div>
);

const routes = (
  <Router history={history}>
    <Redirect from="/" to="monitor" />
    <Route path="/" component={App}>
      <Route path="monitor" component={MonitorPage} onEnter={requireAuth} />
      {/* Отчет префекта */}
      <Route path="odh_coverage_report" component={reports.odhCoverageReport} onEnter={requireAuth} />
      <Route path="dt_coverage_report" component={reports.dtCoverageReport} onEnter={requireAuth} />
      <Route path="dashboard" component={DashboardPage} onEnter={requireAuth} />
      <Route path="waybill-journal" component={WaybillJournal} onEnter={requireAuth} />
      <Route path="company-structure" component={CompanyStructure} onEnter={requireAuth} />
      <Route path="routes-list" component={RoutesList} onEnter={requireAuth} />
      {/* Задания */}
      <Route path="mission-journal" component={missions.missions} onEnter={requireAuth} />
      <Route path="mission-templates-journal" component={missions.missionTemplates} onEnter={requireAuth} />
      <Route path="duty-missions-journal" component={missions.dutyMissions} onEnter={requireAuth} />
      <Route path="duty-mission-templates-journal" component={missions.dutyMissionTemplates} onEnter={requireAuth} />
      {/* Отчеты */}
      {reportRoutes}
      {/* Отчеты - Задания */}
      <Route path="mission-reports" component={reports.mission.all} onEnter={requireAuth}>
        <Route path=":id/odhs/:index" component={reports.mission.singleByODH} onEnter={requireAuth} />
        <Route path=":id/dts/:index" component={reports.mission.singleByDT} onEnter={requireAuth} />
        <Route path=":id/points/:index" component={reports.mission.singleByPoints} onEnter={requireAuth} />
      </Route>
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

export {
  routes,
};
