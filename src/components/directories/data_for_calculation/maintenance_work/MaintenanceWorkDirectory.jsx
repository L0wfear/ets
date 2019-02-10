import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import MaintenanceWorkFormWrap from 'components/directories/data_for_calculation/maintenance_work/MaintenanceWorkFormWrap';
import MaintenanceWorkTable from 'components/directories/data_for_calculation/maintenance_work/MaintenanceWorkTable';
import permissions from 'components/directories/data_for_calculation/maintenance_work/config-data/permissions';
import { getSessionState } from 'redux-main/reducers/selectors';
import { connect } from 'react-redux';
import { compose } from 'recompose';

@connectToStores(['objects'])
@exportable({ entity: 'maintenance_work' })
@staticProps({
  entity: 'maintenance_work',
  permissions,
  listName: 'maintenanceWorkList',
  tableComponent: MaintenanceWorkTable,
  formComponent: MaintenanceWorkFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class MaintenanceWorkDirectory extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions(
      'objects',
    ).deleteMaintenanceWork;
  }

  init() {
    const { flux } = this.context;
    flux.getActions('objects').getMaintenanceWork();
    flux.getActions('odh').getMeasureUnits();
  }
}

export default compose(
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(MaintenanceWorkDirectory);
