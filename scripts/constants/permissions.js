import _ from 'lodash';

const PERMISSIONS = {
  'waybill': {
    'list': 'waybill.list',
    'create': 'waybill.create',
    'read': 'waybill.read',
    'update': 'waybill.update',
    'update_closed': 'waybill.update_closed',
    'plate': 'waybill.plate',
    'delete': 'waybill.delete'
  },
  'company_structure': {
    'list': 'company_structure.list',
    'create': 'company_structure.create',
    'read': 'company_structure.read',
    'update': 'company_structure.update',
    'delete': 'company_structure.delete'
  },
  'company_structure': {
    'list': 'company_structure.list',
    'create': 'company_structure.create',
    'read': 'company_structure.read',
    'update': 'company_structure.update',
    'delete': 'company_structure.delete'
  },
  'monitor': 'monitor',
  'report': 'report.create',
  'nsi': {
    'employee': {
      'list': 'employee.list',
      'create': 'employee.create',
      'read': 'employee.read',
      'update': 'employee.update',
      'delete': 'employee.delete'
    },
    'car': {
      'list': 'car.list',
      'create': 'car.create',
      'read': 'car.read',
      'update': 'car.update',
      'delete': 'car.delete'
    },
    'technical_operation': {
      'list': 'technical_operation.list',
      'create': 'technical_operation.create',
      'read': 'technical_operation.read',
      'update': 'technical_operation.update',
      'delete': 'technical_operation.delete'
    },
    'faxogramm': {
      'list': 'faxogramm.list',
      'create': 'faxogramm.create',
      'read': 'faxogramm.read',
      'update': 'faxogramm.update',
      'delete': 'faxogramm.delete'
    },
    'fuel_consumption_rate': {
      'list': 'fuel_consumption_rate.list',
      'create': 'fuel_consumption_rate.create',
      'read': 'fuel_consumption_rate.read',
      'update': 'fuel_consumption_rate.update',
      'delete': 'fuel_consumption_rate.delete'
    },
    'fuel_operation': {
      'list': 'fuel_operation.list',
      'create': 'fuel_operation.create',
      'read': 'fuel_operation.read',
      'update': 'fuel_operation.update',
      'delete': 'fuel_operation.delete'
    },
    'type': {
      'list': 'type.list',
      'create': 'type.create',
      'read': 'type.read',
      'update': 'type.update',
      'delete': 'type.delete'
    },
    'odh': {
      'list': 'odh.list',
      'create': 'odh.create',
      'read': 'odh.read',
      'update': 'odh.update',
      'delete': 'odh.delete'
    },
    'dt': {
      'list': 'dt.list',
      'create': 'dt.create',
      'read': 'dt.read',
      'update': 'dt.update',
      'delete': 'dt.delete'
    },
    'ssp': {
      'list': 'ssp.list',
      'create': 'ssp.create',
      'read': 'ssp.read',
      'update': 'ssp.update',
      'delete': 'ssp.delete'
    },
    'msp': {
      'list': 'msp.list',
      'create': 'msp.create',
      'read': 'msp.read',
      'update': 'msp.update',
      'delete': 'msp.delete'
    },
    'fueling_water': {
      'list': 'fueling_water.list',
      'create': 'fueling_water.create',
      'read': 'fueling_water.read',
      'update': 'fueling_water.update',
      'delete': 'fueling_water.delete'
    },
    'carpool': {
      'list': 'carpool.list',
      'create': 'carpool.create',
      'read': 'carpool.read',
      'update': 'carpool.update',
      'delete': 'carpool.delete'
    },
    'danger_zone': {
      'list': 'danger_zone.list',
      'create': 'danger_zone.create',
      'read': 'danger_zone.read',
      'update': 'danger_zone.update',
      'delete': 'danger_zone.delete'
    },
    'work_kind': {
      'list': 'work_kind.list',
      'create': 'work_kind.create',
      'read': 'work_kind.read',
      'update': 'work_kind.update',
      'delete': 'work_kind.delete'
    }
  }
}

const NSI_PERMISSIONS = [];
const NSI_LIST_PERMISSIONS = _(PERMISSIONS.nsi).map((v,k) => v.list).value();

console.log(NSI_LIST_PERMISSIONS);

export default {
  nsi: {
    list: NSI_LIST_PERMISSIONS
  }
}
