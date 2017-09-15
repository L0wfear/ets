import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import RepairFormWrap from './RepairFormWrap';
import RepairTable, { tableMeta } from './RepairTable';

@connectToStores(['autobase', 'objects', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.repair}` })
@staticProps({
  entity: 'autobase_repair',
  listName: 'repairList',
  tableComponent: RepairTable,
  formComponent: RepairFormWrap,
  formMeta: tableMeta(),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class RepareList extends ElementsList {
  constructor(props, context) {
    super(props);
    const { car_id = -1 } = props;
    this.removeElementAction = context.flux.getActions('autobase').removeRepair.bind(null, car_id === -1 ? {} : { car_id });
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const { car_id = -1 } = this.props;

    if (car_id === -1) {
      flux.getActions('autobase').getAutobaseListByType('repair');
      flux.getActions('objects').getCars();
    } else {
      flux.getActions('autobase').getAutobaseListByType('repair', { car_id });
      this.exportPayload = { car_id };
    }
  }
}
