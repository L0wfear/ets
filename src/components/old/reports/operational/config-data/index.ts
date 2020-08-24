import { getChildrenData } from 'utils/routes/getChildrenData';

import routeOdhCoverage from 'components/old/reports/operational/route_odh_coverage/config-data';
import mission from 'components/old/reports/operational/mission/config-data';
import carUsageReportWithTrack from 'components/old/reports/operational/car_usage_report_with_track/config-data';
import trackEvents from 'components/old/reports/operational/track_events/config-data';
import brigadeEfficiency from 'components/old/reports/operational/brigade_efficiency/config-data';
import employeeEfficiency from 'components/old/reports/operational/employee_efficiency/config-data';
import missionProgress from 'components/old/reports/operational/mission_progress/config-data';
import longRepair from 'components/old/reports/operational/long_repair/config-data';
import techMaintenanceSchedule from 'components/old/reports/operational/tech_maintenance_schedule/config-data';
import inquiryExpiringDate from 'components/old/reports/operational/inquiry_expiring_date/config-data';
import carCondition from 'components/old/reports/operational/car-condition/config-data';
import carDowntimeAndOvermileage from 'components/old/reports/operational/car_downtime_and_overmileage/config-data';
import carMovementTimeReport from 'components/old/reports/operational/car-movement-time-report/config-data';
import cleaningVolume from 'components/old/reports/operational/cleaning_volume/config-data';
import deviationFromNormOfCars from 'components/old/reports/operational/cars_count_deviation/config-data';
import carsTravelTime from 'components/old/reports/operational/cars_travel_time/config-data';
import fuelCardsReport from 'components/old/reports/operational/fuel_cards_report/config-data';
import сonsumableMaterialUsageReport from 'components/old/reports/operational/consumable_material_usage_report/config-data';
import notCoveredObjectsReport from 'components/old/reports/operational/not_covered_objects_report/config-data';

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
  fuelCardsReport,
  сonsumableMaterialUsageReport,
  notCoveredObjectsReport,
};

export default {
  title: 'Оперативные отчеты',
  children,
  ...getChildrenData(children),
};
