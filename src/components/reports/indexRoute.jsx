import React from 'react';
import { Route } from 'react-router-dom';

import * as reports from './index.js';

const reportRoutes = (props) => [
  <Route path="/odh-reports" component={reports.odh} />,
  <Route path="/route-odh-coverage-report" component={reports.routeOdhCoverage} />,
  <Route path="/coverage-report" component={reports.coverage} />,
  <Route path="/mission-progress-report" component={reports.missionProgress} />,
  <Route path="/fuel-consumption-report" component={reports.fuelConsumption} />,
  <Route path="/fuel-consumption-summary-report" component={reports.fuelConsumptionSummary} />,
  <Route path="/analytics" component={reports.analytics} />,
  <Route path="/car-usage-report" component={reports.carUsageReportWithTrack} />,
  <Route path="/track-events-reports" component={reports.trackEvents} />,
  <Route path="/brigade-efficiency-report" component={reports.brigadeEfficiency} />,
  <Route path="/employee-efficiency-report" component={reports.employeeEfficiency} />,
  <Route path="/daily-cleaning-reports-ets" component={reports.daily.cleaning.ets} />,
  <Route path="/daily-cleaning-reports-cafap" component={reports.daily.cleaning.cafap} />,
  <Route path="/cleaning-status-tech-op-report" component={reports.cleaningStatusTechOp} />,
  <Route path="/long-repair" component={reports.longRepair} />,
  <Route path="/tech-maintenance-schedule" component={reports.techMaintenanceSchedule} />,
  <Route path="/inquiry-expiring-date" component={reports.inquiryExpiringDate} />,
  <Route path="/mission-reports" component={reports.mission} />,
  <Route path="/odh_coverage_report" component={reports.odhCoverageReport} />,
  <Route path="/dt_coverage_report" component={reports.dtCoverageReport} />,
];

export default reportRoutes;
