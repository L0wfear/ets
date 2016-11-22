import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';
import MaintenanceWorkFormWrap from './MaintenanceWorkFormWrap.jsx';
import MaintenanceWorkTable from './MaintenanceWorkTable.jsx';

@connectToStores(['objects'])
// @exportable({ entity: 'maintenance_work' })
@staticProps({
  entity: 'maintenance_work',
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
