const PERMISSIONS = {
  'waybill': {
    'list': 'waybill.list',
    'create': 'waybill.create',
    'read': 'waybill.read',
    'update': 'waybill.update',
    'update_closed': 'waybill.update_closed',
    'plate': 'waybill.plate',
    'delete': 'waybill.delete',
  },
  'missions': {
    'mission': {
      'list': 'mission.list',
      'create': 'mission.create',
      'read': 'mission.read',
      'update': 'mission.update',
      'delete': 'mission.delete',
    },
    'mission_template': {
      'list': 'mission_template.list',
      'create': 'mission_template.create',
      'read': 'mission_template.read',
      'update': 'mission_template.update',
      'delete': 'mission_template.delete',
    },
    'duty_mission': {
      'list': 'duty_mission.list',
      'create': 'duty_mission.create',
      'read': 'duty_mission.read',
      'update': 'duty_mission.update',
      'delete': 'duty_mission.delete',
    },
    'duty_mission_template': {
      'list': 'duty_mission_template.list',
      'create': 'duty_mission_template.create',
      'read': 'duty_mission_template.read',
      'update': 'duty_mission_template.update',
      'delete': 'duty_mission_template.delete',
    },
  },
  'company_structure': {
    'list': 'company_structure.list',
    'create': 'company_structure.create',
    'read': 'company_structure.read',
    'update': 'company_structure.update',
    'delete': 'company_structure.delete',
  },
  'monitor': 'monitor',
  'dashboard': 'dashboard',
  'report': {
    'create': 'report.create',
    'list': 'report.list',
  },
  reportAll: {
    route_odh_coverage_report: {
      list: 'route_odh_coverage_report.list',
    },
    car_travel_report: {
      list: 'car_travel_report.list',
    },
    car_usage_report_with_track_report: {
      list: 'car_usage_report_with_track_report.list',
    },
    track_events_report: {
      list: 'track_events_report.list',
    },
    brigade_efficiency_report: {
      list: 'brigade_efficiency_report.list',
    },
    employee_efficiency_report: {
      list: 'employee_efficiency_report.list',
    },
    mission_progress_report: {
      list: 'mission_progress_report.list',
    },
    autobase_long_repair_report: {
      list: 'autobase_long_repair_report.list',
    },
    autobase_tech_maintenance_schedule_report: {
      list: 'autobase_tech_maintenance_schedule_report.list',
    },
    autobase_inquiry_expiring_date_report: {
      list: 'autobase_inquiry_expiring_date_report.list',
    },
    fuel_consumption_report: {
      list: 'fuel_consumption_report.list',
    },
    fuel_consumption_summary_report: {
      list: 'fuel_consumption_summary_report',
    },
    cleaning_status_report: {
      list: 'cleaning_status_report.list',
    },
    cleaning_status_cafap_report: {
      list: 'cleaning_status_cafap_report.list',
    },
    cleaning_status_tech_op_report: {
      list: 'cleaning_status_tech_op_report.list',
    },
    analytical_reports: {
      list: 'analytical_reports.list',
    },
  },
  'odh_coverage_report': 'odh_coverage_report',
  'dt_coverage_report': 'dt_coverage_report',
  'route': {
    'list': 'route.list',
    'create': 'route.create',
    'read': 'route.read',
    'update': 'route.update',
    'delete': 'route.delete',
  },
  'nsi': {
    'employee': {
      'list': 'employee.list',
      'create': 'employee.create',
      'read': 'employee.read',
      'update': 'employee.update',
      'delete': 'employee.delete',
    },
    'car': {
      'list': 'car.list',
      'create': 'car.create',
      'read': 'car.read',
      'update': 'car.update',
      'delete': 'car.delete',
    },
    'technical_operation': {
      'list': 'technical_operation.list',
      'create': 'technical_operation.create',
      'read': 'technical_operation.read',
      'update': 'technical_operation.update',
      'delete': 'technical_operation.delete',
    },
    'faxogramm': {
      'list': 'faxogramm.list',
      'create': 'faxogramm.create',
      'read': 'faxogramm.read',
      'update': 'faxogramm.update',
      'delete': 'faxogramm.delete',
    },
    'fuel_consumption_rate': {
      'list': 'fuel_consumption_rate.list',
      'create': 'fuel_consumption_rate.create',
      'read': 'fuel_consumption_rate.read',
      'update': 'fuel_consumption_rate.update',
      'delete': 'fuel_consumption_rate.delete',
    },
    'fuel_operation': {
      'list': 'fuel_operation.list',
      'create': 'fuel_operation.create',
      'read': 'fuel_operation.read',
      'update': 'fuel_operation.update',
      'delete': 'fuel_operation.delete',
    },
    'type': {
      'list': 'type.list',
      'create': 'type.create',
      'read': 'type.read',
      'update': 'type.update',
      'delete': 'type.delete',
    },
    'odh': {
      'list': 'odh.list',
      'create': 'odh.create',
      'read': 'odh.read',
      'update': 'odh.update',
      'delete': 'odh.delete',
    },
    'dt': {
      'list': 'dt.list',
      'create': 'dt.create',
      'read': 'dt.read',
      'update': 'dt.update',
      'delete': 'dt.delete',
    },
    'ssp': {
      'list': 'ssp.list',
      'create': 'ssp.create',
      'read': 'ssp.read',
      'update': 'ssp.update',
      'delete': 'ssp.delete',
    },
    'msp': {
      'list': 'msp.list',
      'create': 'msp.create',
      'read': 'msp.read',
      'update': 'msp.update',
      'delete': 'msp.delete',
    },
    'fueling_water': {
      'list': 'fueling_water.list',
      'create': 'fueling_water.create',
      'read': 'fueling_water.read',
      'update': 'fueling_water.update',
      'delete': 'fueling_water.delete',
    },
    'carpool': {
      'list': 'carpool.list',
      'create': 'carpool.create',
      'read': 'carpool.read',
      'update': 'carpool.update',
      'delete': 'carpool.delete',
    },
    'danger_zone': {
      'list': 'danger_zone.list',
      'create': 'danger_zone.create',
      'read': 'danger_zone.read',
      'update': 'danger_zone.update',
      'delete': 'danger_zone.delete',
    },
    'work_kind': {
      'list': 'work_kind.list',
      'create': 'work_kind.create',
      'read': 'work_kind.read',
      'update': 'work_kind.update',
      'delete': 'work_kind.delete',
    },
    'user_action_log': {
      'list': 'user_action_log.list',
    },
    'medical_stats': {
      'list': 'medical_stats.list',
    },
    'company': {
      'list': 'company.list',
    },
  },
  'administration': 'administration',
};

const NSI_LIST_PERMISSIONS = Object.values(PERMISSIONS.nsi).map(v => v.list);
const MISSIONS_LIST_PERMISSIONS = Object.values(PERMISSIONS.missions).map(v => v.list);
const REPORT_LIST_PERMISSIONS = Object.values(PERMISSIONS.reportAll).map(v => v.list);

PERMISSIONS.nsi.list = NSI_LIST_PERMISSIONS;
PERMISSIONS.missions.list = MISSIONS_LIST_PERMISSIONS;
PERMISSIONS.reportAll.list = REPORT_LIST_PERMISSIONS;

export default PERMISSIONS;
