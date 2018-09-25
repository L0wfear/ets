import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import MaintenanceWorkFormWrap from 'components/directories/data_for_calculation/maintenance_work/MaintenanceWorkFormWrap';
import MaintenanceWorkTable from 'components/directories/data_for_calculation/maintenance_work/MaintenanceWorkTable';
import permissions from 'components/directories/data_for_calculation/maintenance_work/config-data/permissions';

@connectToStores(['objects'])
// @exportable({ entity: 'maintenance_work' })
@staticProps({
  entity: 'maintenance_work',
  permissions,
  listName: 'maintenanceWorkList',
  tableComponent: MaintenanceWorkTable,
  formComponent: MaintenanceWorkFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class MaintenanceWorkDirectory extends ElementsList {

  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('objects').deleteMaintenanceWork;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('objects').getMaintenanceWork();
    flux.getActions('odh').getMeasureUnits();
  }
}
