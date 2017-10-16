const routerAndPermission = {
  monitor: {
    path: '/monitor',
    permissions: {
      list: 'monitor',
    },
  },
  CoverageReport: {
    children: {
      odhCoverageReport: {
        path: '/odh_coverage_report',
        permissions: {
          list: 'odh_coverage_report',
        },
      },
      dtCoverageReport: {
        path: '/dt_coverage_report',
        permissions: {
          list: 'dt_coverage_report',
        },
      },
    },
  },
  dashboard: {
    path: '/dashboard',
    permissions: {
      list: 'dashboard',
    },
  },
  waybillJournal: {
    path: '/waybill-journal',
    permissions: {
      list: 'waybill.list',
      create: 'waybill.create',
      read: 'waybill.read',
      update: 'waybill.update',
      update_closed: 'waybill.update_closed',
      plate: 'waybill.plate',
      delete: 'waybill.delete',
    },
  },
  missions: {
    children: {
      'mission-journal': {
        path: '/mission-templates-journal',
        permissions: {
          list: 'mission.list',
          create: 'mission.create',
          read: 'mission.read',
          update: 'mission.update',
          delete: 'mission.delete',
        },
      },
      'mission-templates-journal': {
        path: '/mission-templates-journal',
        permissions: {
          list: 'mission_template.list',
          create: 'mission_template.create',
          read: 'mission_template.read',
          update: 'mission_template.update',
          delete: 'mission_template.delete',
        },
      },
      'duty-missions-journal': {
        path: '/duty-missions-journal',
        permissions: {
          list: 'duty_mission.list',
          create: 'duty_mission.create',
          read: 'duty_mission.read',
          update: 'duty_mission.update',
          delete: 'duty_mission.delete',
        },
      },
      'duty-mission-templates-journal': {
        path: '/duty-mission-templates-journal',
        permissions: {
          list: 'duty_mission_template.list',
          create: 'duty_mission_template.create',
          read: 'duty_mission_template.read',
          update: 'duty_mission_template.update',
          delete: 'duty_mission_template.delete',
        },
      },
    },
  },
  nsi: {
    children: {
      employees: {
        path: '/employees',
        permissions: {
          list: 'employee.list',
          create: 'employee.create',
          read: 'employee.read',
          update: 'employee.update',
          delete: 'employee.delete',
        },
      },
      faxogramms: {
        path: '/faxogramms',
        permissions: {
          list: 'faxogramm.list',
          create: 'faxogramm.create',
          read: 'faxogramm.read',
          update: 'faxogramm.update',
          delete: 'faxogramm.delete',
        },
      },
      technicalOperation: {
        path: '/hzItremove',
        permissions: {
          list: 'technical_operation.list',
          create: 'technical_operation.create',
          read: 'technical_operation.read',
          update: 'technical_operation.update',
          delete: 'technical_operation.delete',
        },
      },
      transportation: {
        children: {
          carFuncTypes: {
            path: '/car-func-types',
            permissions: {
              list: 'type.list',
              create: 'type.create',
              read: 'type.read',
              update: 'type.update',
              delete: 'type.delete',
            },
          },
          cars: {
            path: '/cars',
            permissions: {
              list: 'car.list',
              create: 'car.create',
              read: 'car.read',
              update: 'car.update',
              delete: 'car.delete',
            },
          },
          batteryRegistry: {
            path: '/battery-registry',
            permissions: {
              list: 'autobase_battery.list',
              create: 'autobase_battery.create',
              read: 'autobase_battery.read',
              update: 'autobase_battery.update',
              delete: 'autobase_battery.delete',
            },
          },
          batteryBrand: {
            path: '/battery-brand',
            permissions: {
              list: 'autobase_battery_brand.list',
              create: 'autobase_battery_brand.create',
              read: 'autobase_battery_brand.read',
              update: 'autobase_battery_brand.update',
              delete: 'autobase_battery_brand.delete',
            },
          },
          batteryManufacturer: {
            path: '/battery-manufacturer',
            permissions: {
              list: 'autobase_battery_manufacturer.list',
              create: 'autobase_battery_manufacturer.create',
              read: 'autobase_battery_manufacturer.read',
              update: 'autobase_battery_manufacturer.update',
              delete: 'autobase_battery_manufacturer.delete',
            },
          },
          tire: {
            path: '/tire',
            permissions: {
              list: 'autobase_tire.list',
              create: 'autobase_tire.create',
              read: 'autobase_tire.read',
              update: 'autobase_tire.update',
              delete: 'autobase_tire.delete',
            },
          },
          tireModel: {
            path: '/tire-model',
            permissions: {
              list: 'autobase_tire_model.list',
              create: 'autobase_tire_model.create',
              read: 'autobase_tire_model.read',
              update: 'autobase_tire_model.update',
              delete: 'autobase_tire_model.delete',
            },
          },
          sparePart: {
            path: '/spare-part',
            permissions: {
              list: 'autobase_spare_part.list',
              create: 'autobase_spare_part.create',
              read: 'autobase_spare_part.read',
              update: 'autobase_spare_part.update',
              delete: 'autobase_spare_part.delete',
            },
          },
          techMaintenanceOrderRegistry: {
            path: '/tech-maintenance-order-registry',
            permissions: {
              list: 'autobase_tech_maintenance_order.list',
              create: 'autobase_tech_maintenance_order.create',
              read: 'autobase_tech_maintenance_order.read',
              update: 'autobase_tech_maintenance_order.update',
              delete: 'autobase_tech_maintenance_order.delete',
            },
          },
          techInspection: {
            path: '/tech-inspection',
            permissions: {
              list: 'autobase_tech_inspection.list',
              create: 'autobase_tech_inspection.create',
              read: 'autobase_tech_inspection.read',
              update: 'autobase_tech_inspection.update',
              delete: 'autobase_tech_inspection.delete',
            },
          },
          insurancePolicy: {
            path: '/insurance-policy',
            permissions: {
              list: 'autobase_insurance_policy.list',
              create: 'autobase_insurance_policy.create',
              read: 'autobase_insurance_policy.read',
              update: 'autobase_insurance_policy.update',
              delete: 'autobase_insurance_policy.delete',
            },
          },
          repairCompany: {
            path: '/repair-company',
            permissions: {
              list: 'autobase_company.list',
              create: 'autobase_company.create',
              read: 'autobase_company.read',
              update: 'autobase_company.update',
              delete: 'autobase_company.delete',
            },
          },
        },
      },
      planeWorkOnContentObjects: {
        children: {
          contractor: {
            path: '/repair-company',
            permissions: {
              list: 'repair_contractor.list',
              create: 'repair_contractor.create',
              read: 'repair_contractor.read',
              update: 'repair_contractor.update',
              delete: 'repair_contractor.delete',
            },
          },
          stateProgram: {
            path: '/state-programy',
            permissions: {
              list: 'repair_state_program.list',
              create: 'repair_state_program.create',
              read: 'repair_state_program.read',
              update: 'repair_state_program.update',
              delete: 'repair_state_program.delete',
            },
          },
          objectPropertyList: {
            path: '/object-property-list',
            permissions: {
              list: 'ets_object_properties.list',
              create: 'ets_object_properties.create',
              read: 'ets_object_properties.read',
              update: 'ets_object_properties.update',
              delete: 'ets_object_properties.delete',
            },
          },
        },
      },
      normative: {
        children: {
          contramaterialConsumptionRatector: {
            path: '/material-consumption-rate',
            permissions: {
              list: 'material_consumption_rate.list',
              create: 'material_consumption_rate.create',
              read: 'material_consumption_rate.read',
              update: 'material_consumption_rate.update',
              delete: 'material_consumption_rate.delete',
            },
          },
          fuelRates: {
            path: '/fuel-rates',
            permissions: {
              list: 'fuel_consumption_rate.list',
              create: 'fuel_consumption_rate.create',
              read: 'fuel_consumption_rate.read',
              update: 'fuel_consumption_rate.update',
              delete: 'fuel_consumption_rate.delete',
            },
          },
          maintenanceRate: {
            path: '/maintenance-rate',
            permissions: {
              list: 'maintenance_rate.list',
              create: 'maintenance_rate.create',
              read: 'maintenance_rate.read',
              update: 'maintenance_rate.update',
              delete: 'maintenance_rate.delete',
            },
          },
        },
      },
      geoObjects: {
        children: {
          odh: {
            path: '/odh',
            permissions: {
              list: 'odh.list',
              create: 'odh.create',
              read: 'odh.read',
              update: 'odh.update',
              delete: 'odh.delete',
            },
          },
          dt: {
            path: '/dt',
            permissions: {
              list: 'dt.list',
              create: 'dt.create',
              read: 'dt.read',
              update: 'dt.update',
              delete: 'dt.delete',
            },
          },
          ssp: {
            path: '/ssp',
            permissions: {
              list: 'ssp.list',
              create: 'ssp.create',
              read: 'ssp.read',
              update: 'ssp.update',
              delete: 'ssp.delete',
            },
          },
          msp: {
            path: '/msp',
            permissions: {
              list: 'msp.list',
              create: 'msp.create',
              read: 'msp.read',
              update: 'msp.update',
              delete: 'msp.delete',
            },
          },
          fuelingWater: {
            path: '/fueling-water',
            permissions: {
              list: 'fueling_water.list',
              create: 'fueling_water.create',
              read: 'fueling_water.read',
              update: 'fueling_water.update',
              delete: 'fueling_water.delete',
            },
          },
          carpool: {
            path: '/carpool',
            permissions: {
              list: 'carpool.list',
              create: 'carpool.create',
              read: 'carpool.read',
              update: 'carpool.update',
              delete: 'carpool.delete',
            },
          },
          dangerZones: {
            path: '/danger-zones',
            permissions: {
              list: 'danger_zone.list',
              create: 'danger_zone.create',
              read: 'danger_zone.read',
              update: 'danger_zone.update',
              delete: 'danger_zone.delete',
            },
          },
          pgm: {
            path: '/pgm',
            permissions: {
              list: 'pgm.list',
              create: 'pgm.create',
              read: 'pgm.read',
              update: 'pgm.update',
              delete: 'pgm.delete',
            },
          },
          snowStorage: {
            path: '/snow-storage',
            permissions: {
              list: 'snow_storage.list',
              create: 'snow_storage.create',
              read: 'snow_storage.read',
              update: 'snow_storage.update',
              delete: 'snow_storage.delete',
            },
          },
          bridges: {
            path: '/bridges',
            permissions: {
              list: 'bridges.list',
              create: 'bridges.create',
              read: 'bridges.read',
              update: 'bridges.update',
              delete: 'bridges.delete',
            },
          },
          pedestrianTunnels: {
            path: '/pedestrian-tunnels',
            permissions: {
              list: 'pedestrian_tunnels.list',
              create: 'pedestrian_tunnels.create',
              read: 'pedestrian_tunnels.read',
              update: 'pedestrian_tunnels.update',
              delete: 'pedestrian_tunnels.delete',
            },
          },
          pedestrianTunnelExits: {
            path: '/pedestrian-tunnel-exits',
            permissions: {
              list: 'pedestrian_tunnel_exits.list',
              create: 'pedestrian_tunnel_exits.create',
              read: 'pedestrian_tunnel_exits.read',
              update: 'pedestrian_tunnel_exits.update',
              delete: 'pedestrian_tunnel_exits.delete',
            },
          },
          fountains: {
            path: '/fountains',
            permissions: {
              list: 'fountains.list',
              create: 'fountains.create',
              read: 'fountains.read',
              update: 'fountains.update',
              delete: 'fountains.delete',
            },
          },
        },
      },
      dataForCalculation: {
        children: {
          cleaningRate: {
            path: '/cleaning-rate',
            permissions: {
              list: 'cleaning_rate.list',
              create: 'cleaning_rate.create',
              read: 'cleaning_rate.read',
              update: 'cleaning_rate.update',
              delete: 'cleaning_rate.delete',
            },
          },
          odhNorm: {
            path: '/odh-norm',
            permissions: {
              list: 'odh_norm.list',
              create: 'odh_norm.create',
              read: 'odh_norm.read',
              update: 'odh_norm.update',
              delete: 'odh_norm.delete',
            },
          },
          maintenanceWork: {
            path: '/maintenance-work',
            permissions: {
              list: 'maintenance_work.list',
              create: 'maintenance_work.create',
              read: 'maintenance_work.read',
              update: 'maintenance_work.update',
              delete: 'maintenance_work.delete',
            },
          },
          fuelOperations: {
            path: '/fuel-operations',
            permissions: {
              list: 'fuel_operation.list',
              create: 'fuel_operation.create',
              read: 'fuel_operation.read',
              update: 'fuel_operation.update',
              delete: 'fuel_operation.delete',
            },
          },
          odhNormDataSummer: {
            path: '/odh-norm-data-summer',
            permissions: {
              list: 'odh_norm_data_summer.list',
              create: 'odh_norm_data_summer.create',
              read: 'odh_norm_data_summer.read',
              update: 'odh_norm_data_summer.update',
              delete: 'odh_norm_data_summer.delete',
            },
          },
          efficiency: {
            path: '/efficiency',
            permissions: {
              list: 'efficiency.list',
              create: 'efficiency.create',
              read: 'efficiency.read',
              update: 'efficiency.update',
              delete: 'efficiency.delete',
            },
          },
        },
      },
      medicalStats: {
        path: '/medical-stats',
        permissions: {
          list: 'medical_stats.list',
          create: 'medical_stats.create',
          read: 'medical_stats.read',
          update: 'medical_stats.update',
          delete: 'medical_stats.delete',
        },
      },
      userActionLog: {
        path: '/user-action-log',
        permissions: {
          list: 'user_action_log.list',
        },
      },
    },
  },
  reports: {
    children: {
      operational: {
        children: {
          routeOdhCoverageReport: {
            path: '/route-odh-coverage-report',
            permissions: {
              list: 'route_odh_coverage_report.list',
              create: 'route_odh_coverage_report.create',
              read: 'route_odh_coverage_report.read',
              update: 'route_odh_coverage_report.update',
              delete: 'route_odh_coverage_report.delete',
            },
          },
          missionReports: {
            path: '/mission-reports',
            permissions: {
              list: 'car_travel_report.list',
              create: 'car_travel_report.create',
              read: 'car_travel_report.read',
              update: 'car_travel_report.update',
              delete: 'car_travel_report.delete',
            },
          },
          carUsageReportWithTrack: {
            path: '/car-usage-report-with-track',
            permissions: {
              list: 'car_usage_report_with_track_report.list',
              create: 'car_usage_report_with_track_report.create',
              read: 'car_usage_report_with_track_report.read',
              update: 'car_usage_report_with_track_report.update',
              delete: 'car_usage_report_with_track_report.delete',
            },
          },
          trackEventsReports: {
            path: '/track-events-reports',
            permissions: {
              list: 'track_events_report.list',
              create: 'track_events_report.create',
              read: 'track_events_report.read',
              update: 'track_events_report.update',
              delete: 'track_events_report.delete',
            },
          },
          brigadeEfficiencyReport: {
            path: '/brigade-efficiency-report',
            permissions: {
              list: 'brigade_efficiency_report.list',
              create: 'brigade_efficiency_report.create',
              read: 'brigade_efficiency_report.read',
              update: 'brigade_efficiency_report.update',
              delete: 'brigade_efficiency_report.delete',
            },
          },
          employeeEfficiencyReport: {
            path: '/employee-efficiency-report',
            permissions: {
              list: 'employee_efficiency_report.list',
              create: 'employee_efficiency_report.create',
              read: 'employee_efficiency_report.read',
              update: 'employee_efficiency_report.update',
              delete: 'employee_efficiency_report.delete',
            },
          },
          missionProgressReport: {
            path: '/mission-progress-report',
            permissions: {
              list: 'mission_progress_report.list',
              create: 'mission_progress_report.create',
              read: 'mission_progress_report.read',
              update: 'mission_progress_report.update',
              delete: 'mission_progress_report.delete',
            },
          },
          longRepair: {
            path: '/long-repair',
            permissions: {
              list: 'autobase_long_repair_report.list',
              create: 'autobase_long_repair_report.create',
              read: 'autobase_long_repair_report.read',
              update: 'autobase_long_repair_report.update',
              delete: 'autobase_long_repair_report.delete',
            },
          },
          techMaintenanceSchedule: {
            path: '/tech-maintenance-schedule',
            permissions: {
              list: 'autobase_tech_maintenance_schedule_report.list',
              create: 'autobase_tech_maintenance_schedule_report.create',
              read: 'autobase_tech_maintenance_schedule_report.read',
              update: 'autobase_tech_maintenance_schedule_report.update',
              delete: 'autobase_tech_maintenance_schedule_report.delete',
            },
          },
          inquiryExpiringDate: {
            path: '/inquiry-expiring-date',
            permissions: {
              list: 'autobase_inquiry_expiring_date_report.list',
              create: 'autobase_inquiry_expiring_date_report.create',
              read: 'autobase_inquiry_expiring_date_report.read',
              update: 'autobase_inquiry_expiring_date_report.update',
              delete: 'autobase_inquiry_expiring_date_report.delete',
            },
          },
        },
      },
      regulated: {
        children: {
          fuelСonsumptionReport: {
            path: '/fuel-consumption-report',
            permissions: {
              list: 'fuel_consumption_report.list',
              create: 'fuel_consumption_report.create',
              read: 'fuel_consumption_report.read',
              update: 'fuel_consumption_report.update',
              delete: 'fuel_consumption_report.delete',
            },
          },
          fuelConsumptionSummaryReport: {
            path: '/fuel-consumption-summary-report',
            permissions: {
              list: 'fuel_consumption_summary_report.list',
              create: 'fuel_consumption_summary_report.create',
              read: 'fuel_consumption_summary_report.read',
              update: 'fuel_consumption_summary_report.update',
              delete: 'fuel_consumption_summary_report.delete',
            },
          },
          dailyCleaningReportsEts: {
            path: '/daily-cleaning-reports-ets',
            permissions: {
              list: 'cleaning_status_report.list',
              create: 'cleaning_status_report.create',
              read: 'cleaning_status_report.read',
              update: 'cleaning_status_report.update',
              delete: 'cleaning_status_report.delete',
            },
          },
          dailyCleaningReportsCafap: {
            path: '/daily-cleaning-reports-cafap',
            permissions: {
              list: 'cleaning_status_cafap_report.list',
              create: 'cleaning_status_cafap_report.create',
              read: 'cleaning_status_cafap_report.read',
              update: 'cleaning_status_cafap_report.update',
              delete: 'cleaning_status_cafap_report.delete',
            },
          },
          cleaningStatusTechOpReport: {
            path: '/cleaning-status-tech-op-report',
            permissions: {
              list: 'cleaning_status_tech_op_report.list',
              create: 'cleaning_status_tech_op_report.create',
              read: 'cleaning_status_tech_op_report.read',
              update: 'cleaning_status_tech_op_report.update',
              delete: 'cleaning_status_tech_op_report.delete',
            },
          },
        },
      },
      analytics: {
        path: '/efficiency',
        permissions: {
          list: 'analytical_reports.list',
          create: 'analytical_reports.create',
          read: 'analytical_reports.read',
          update: 'analytical_reports.update',
          delete: 'analytical_reports.delete',
        },
      },
    },
  },
  routeList: {
    path: '/routes-list',
    permissions: {
      list: 'route.list',
    },
  },
  companyStructure: {
    path: '/company-structure',
    permissions: {
      list: 'company_structure.list',
    },
  },
  notificationRegistry: {
    path: '/notification-registry',
    permissions: {
      list: [
        'insurance_policy_notification.list',
        'medical_certificate_notification.list',
        'order_notification.list',
        'repair_notification.list',
        'tech_inspection_notification.list',
        'tech_maintenance_notification.list',
      ],
    },
  },
  programRegistry: {
    path: '/program-registry',
    permissions: {
      list: 'repair_program.list',
    },
  },
};

const getRouterToPermission = (rAp, level) => {
  return Object.values(rAp).reduce((rtp, val) => {
    if (!val.children) {
      rtp[val.path] = {
        p: val.permissions.list,
        lvl: level,
      };
    } else {
      rtp = {
        ...rtp,
        ...getRouterToPermission(val.children, level + 1),
      };
    }
    return rtp;
  },
  {});
};

const routToPer = getRouterToPermission(routerAndPermission, 1);

export default routerAndPermission;
export {
  routToPer,
};
