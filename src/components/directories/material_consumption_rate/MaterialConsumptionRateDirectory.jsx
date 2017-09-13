import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import MaterialConsumptionRateFormWrap from './MaterialConsumptionRateFormWrap.jsx';
import MaterialConsumptionRateTable from './MaterialConsumptionRateTable.tsx';

@connectToStores(['objects'])
@exportable({ entity: 'material_consumption_rate' })
@staticProps({
  entity: 'material_consumption_rate',
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
