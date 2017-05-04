import React from 'react';
import { Route, Redirect } from 'react-router';

import * as reports from './index.js';
      // <Redirect from="fuel-consumption-report" to="fuel-consumption-report/level/1" />
      // <Route path="fuel-consumption-report/level/1" component={reports.fuelConsumption.firstLevel} onEnter={requireAuth}>
      //   <Route path="/fuel-consumption-report/level/2" component={reports.fuelConsumption.secondLevel} onEnter={requireAuth} />
      // </Route>

const reportRoutes = (props) => {
  const { requireAuth } = props;
  const routes = (
    <div>
      {/* Отчеты */}
      <Route path="odh-reports" component={reports.odh} onEnter={requireAuth} />
      <Route path="route-reports" component={reports.route.all} onEnter={requireAuth} />
      <Route path="route-report/:id" component={reports.route.single} onEnter={requireAuth} />
      <Route path="coverage-report" component={reports.coverage} onEnter={requireAuth} />

      <Route path="fuel-consumption-report" component={reports.fuelConsumption} onEnter={requireAuth} />

      <Route path="analytics" component={reports.analytics} onEnter={requireAuth} />
      <Route path="car_func_type_usage_reports" component={reports.carFuncTypeUsage.all} onEnter={requireAuth} />
      <Route path="car_func_type_usage_report" component={reports.carFuncTypeUsage.single} onEnter={requireAuth} />

      <Redirect from="track-events-reports" to="track-events-reports/level/1" />
      <Route path="track-events-reports/level/1" component={reports.trackEvents.firstLevel} onEnter={requireAuth}>
        <Route path="/track-events-reports/level/2" component={reports.trackEvents.secondLevel} onEnter={requireAuth} />
      </Route>

      <Route path="brigade-efficiency-report" component={reports.brigadeEfficiency} onEnter={requireAuth} />
      <Route path="employee-efficiency-report" component={reports.employeeEfficiency} onEnter={requireAuth} />

      <Route path="daily-cleaning-reports-ets" component={reports.daily.cleaning.ets.all} onEnter={requireAuth} />
      <Route path="daily-cleaning-report-ets/:element/:id" component={reports.daily.cleaning.ets.single} onEnter={requireAuth} />
      <Route path="daily-cleaning-reports-cafap" component={reports.daily.cleaning.cafap.all} onEnter={requireAuth} />
      <Route path="daily-cleaning-report-cafap/:element/:id" component={reports.daily.cleaning.cafap.single} onEnter={requireAuth} />
      <Route path="weekly-technical-operation-complete-reports" component={reports.weekly.technicalOperationComplete.all} onEnter={requireAuth} />
      <Route path="weekly-technical-operation-complete-report/:element/:id" component={reports.weekly.technicalOperationComplete.single} onEnter={requireAuth} />
      {/* Отчеты - Задания */}
      <Route path="mission-reports" component={reports.mission.all} onEnter={requireAuth}>
        <Route path=":id/odhs/:index" component={reports.mission.singleByODH} onEnter={requireAuth} />
        <Route path=":id/dts/:index" component={reports.mission.singleByDT} onEnter={requireAuth} />
        <Route path=":id/points/:index" component={reports.mission.singleByPoints} onEnter={requireAuth} />
      </Route>
      {/* Отчет префекта */}
      <Route path="odh_coverage_report" component={reports.odhCoverageReport} onEnter={requireAuth} />
      <Route path="dt_coverage_report" component={reports.dtCoverageReport} onEnter={requireAuth} />
    </div>
  );

  return routes;
};

reportRoutes.propTypes = {
  requireAuth: React.PropTypes.func,
};


export { reportRoutes };
