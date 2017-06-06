import TechnicalOperationFormWrap from './TechnicalOperationFormWrap.jsx';
import TechnicalOperationsTable from './TechnicalOperationsTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['objects'])
@exportable({ entity: 'technical_operation' })
@staticProps({
  entity: 'technical_operation',
  listName: 'technicalOperationsList',
  tableComponent: TechnicalOperationsTable,
  formComponent: TechnicalOperationFormWrap,
  operations: ['READ', 'UPDATE'],
})
export default class TechOperationsDirectory extends ElementsList {

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('technicalOperation').getTechnicalOperations(true);
    flux.getActions('objects').getTypes();
  }

}
