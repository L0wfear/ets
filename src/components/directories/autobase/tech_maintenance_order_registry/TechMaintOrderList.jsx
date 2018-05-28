import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import TechMaintOrderFormWrap from 'components/directories/autobase/tech_maintenance_order_registry/TechMaintOrderFormWrap';
import TechMaintOrderTable from 'components/directories/autobase/tech_maintenance_order_registry/TechMaintOrderTable';
import permissions from 'components/directories/autobase/tech_maintenance_order_registry/config-data/permissions';

@connectToStores(['autobase', 'session', 'objects'])
@exportable({ entity: `autobase/${AUTOBASE.techMaintOrder}` })
@staticProps({
  entity: 'autobase_tech_maintenance_order',
  permissions,
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
    const { car_id = -1 } = this.props;

    if (car_id === -1) {
      flux.getActions('autobase').getAutobaseListByType('techMaintOrder');
    } else {
      flux.getActions('autobase').getAutobaseListByType('techMaintOrder', { car_id });
      this.exportPayload = { car_id };
    }
  }
}
