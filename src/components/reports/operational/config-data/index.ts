import { getChildrenData } from 'utils/routes/getChildrenData';

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
import carCondition from 'components/reports/operational/car-condition/config-data';
import carDowntimeAndOvermileage from 'components/reports/operational/car_downtime_and_overmileage/config-data';
import carMovementTimeReport from 'components/reports/operational/car-movement-time-report/config-data';
import cleaningVolume from 'components/reports/operational/cleaning_volume/config-data';
import deviationFromNormOfCars from 'components/reports/operational/cars_count_deviation/config-data';
import carsTravelTime from 'components/reports/operational/cars_travel_time/config-data';
import carsTravelTimeNew from 'components/reports/operational/cars_travel_time_new/config-data';
import fuelCardsReport from 'components/reports/operational/fuel_cards_report/config-data';

const children: any = {
  routeOdhCoverage,
  mission,
  carUsageReportWithTrack,
  trackEvents,
  brigadeEfficiency,
  employeeEfficiency,
  missionProgress,
  longRepair,
  techMaintenanceSchedule,
  inquiryExpiringDate,
  carCondition,
  carDowntimeAndOvermileage,
  carMovementTimeReport,
  cleaningVolume,
  deviationFromNormOfCars,
  carsTravelTime,
  carsTravelTimeNew,
  fuelCardsReport,
};

export default {
  title: 'Оперативные отчеты',
  children,
  ...getChildrenData(children),
};
