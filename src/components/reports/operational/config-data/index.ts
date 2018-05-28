import { getChildrenPermissions } from 'utils/routes/getChildrenPermissions';

import routeOdhCoverage from 'components/reports/operational/route_odh_coverage/config-data';
import mission from 'components/reports/operational/mission/config-data';
import carUsageReportWithTrack from 'components/reports/operational/car_usage_report_with_track/config-data';
import trackEvents from 'components/reports/operational/track_events/config-data';
import brigadeEfficiency from 'components/reports/operational/brigade_efficiency/config-data';
import employeeEfficiency from 'components/reports/operational/employee_efficiency/config-data';
import missionProgress from 'components/reports/operational/mission_progress/config-data';
import longRepair from 'components/reports/operational/long_repair/config-data';
import techMaintenanceSchedule from 'components/reports/operational/tech_maintenance_schedule/config-data';
import inquiryExpiringDate from 'components/reports/operational/inquiry_expiring_date/config-data';

const children = {
  routeOdhCoverage,
  mission,
  carUsageReportWithTrack,
  trackEvents,
  brigadeEfficiency,
  employeeEfficiency,
  missionProgress,
  longRepair,
  techMaintenanceSchedule,
  inquiryExpiringDate
};

export default {
  title: 'Оперативные отчеты',
  children,
  permissions: getChildrenPermissions(children),
};
