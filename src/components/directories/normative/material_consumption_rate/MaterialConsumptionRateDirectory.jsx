import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList';
import MaterialConsumptionRateFormWrap from 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateFormWrap';
import MaterialConsumptionRateTable from 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateTable';
import permissions from 'components/directories/normative/material_consumption_rate/config-data/permissions';

@connectToStores(['objects'])
@exportable({ entity: 'material_consumption_rate' })
@staticProps({
  entity: 'material_consumption_rate',
  permissions,
  listName: 'materialConsumptionRateList',
  tableComponent: MaterialConsumptionRateTable,
  formComponent: MaterialConsumptionRateFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class List extends ElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('objects').deleteMaterialConsumptionRate;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('objects').getMaterialConsumptionRate();
    flux.getActions('objects').getCleanCategories();
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('odh').getODHNorm();
  }

}
