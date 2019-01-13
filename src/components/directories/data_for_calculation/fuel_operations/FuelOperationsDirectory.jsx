import FuelOperationFormWrap from 'components/directories/data_for_calculation/fuel_operations/FuelOperationFormWrap';
import FuelOperationsTable from 'components/directories/data_for_calculation/fuel_operations/FuelOperationsTable';
import ElementsList from 'components/ElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import permissions from 'components/directories/data_for_calculation/fuel_operations/config-data/permissions';

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
export default class FuelOperationsDirectory extends ElementsList {

  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('fuelRates').deleteFuelOperation;
  }

  exportPayload = {
    is_active: true,
  }

  init() {
    const { flux } = this.context;
    flux.getActions('fuelRates').getFuelOperations({ is_active: true });
    flux.getActions('odh').getMeasureUnits({ type: 'operation' });
  }
}
