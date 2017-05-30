import React from 'react';
import { Route, Redirect } from 'react-router';

import * as reports from './index.js';

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

      <Route path="daily-cleaning-reports-ets" component={reports.daily.cleaning.ets} onEnter={requireAuth} />

      <Route path="daily-cleaning-reports-cafap" component={reports.daily.cleaning.cafap} onEnter={requireAuth} />

      <Route path="cleaning-status-tech-op-report" component={reports.cleaningStatusTechOp} onEnter={requireAuth} />
      {/* Отчеты - Задания */}
      <Route path="mission-reports" component={reports.mission} onEnter={requireAuth} />
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


export default reportRoutes;
