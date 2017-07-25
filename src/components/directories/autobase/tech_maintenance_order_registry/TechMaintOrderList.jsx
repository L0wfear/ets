import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import TechMaintOrderFormWrap from './TechMaintOrderFormWrap';
import TechMaintOrderTable from './TechMaintOrderTable';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.techMaintOrder}` })
@staticProps({
  entity: 'autobase_tech_maintenance_order',
  listName: 'techMaintOrderList',
  tableComponent: TechMaintOrderTable,
  formComponent: TechMaintOrderFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class TechMaintOrderList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeTechMaintOrder;
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('techMaintOrder');
  }
}
