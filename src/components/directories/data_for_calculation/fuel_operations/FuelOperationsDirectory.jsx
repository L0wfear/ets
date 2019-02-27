import FuelOperationFormWrap from 'components/directories/data_for_calculation/fuel_operations/FuelOperationFormWrap';
import FuelOperationsTable from 'components/directories/data_for_calculation/fuel_operations/FuelOperationsTable';
import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import permissions from 'components/directories/data_for_calculation/fuel_operations/config-data/permissions';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

@connectToStores(['fuelRates', 'objects', 'odh'])
@exportable({ entity: 'fuel_operations' })
@staticProps({
  entity: 'fuel_operation',
  permissions,
  listName: 'operations',
  tableComponent: FuelOperationsTable,
  formComponent: FuelOperationFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class FuelOperationsDirectory extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions(
      'fuelRates',
    ).deleteFuelOperation;
  }

  exportPayload = {
    is_active: true,
  };

  init() {
    const { flux } = this.context;
    this.loadData();
    flux.getActions('odh').getMeasureUnits({ type: 'operation' });
  }

  loadData() {
    const { flux } = this.context;
    flux.getActions('fuelRates').getFuelOperations({ is_active: true });
  }

  onFormHide = () => {
    this.loadData();

    this.setState({
      showForm: false,
      selectedElement: null,
    });
  };
}

export default compose(
  connect((state) => ({
    userData: getSessionState(state).userData,
  })),
)(FuelOperationsDirectory);
