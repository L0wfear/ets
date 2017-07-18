import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import BatteryRegFormWrap from './BatteryRegFormWrap.jsx';
import BatteryRegTable, { tableMeta } from './BatteryRegTable.jsx';

@connectToStores(['autobase', 'objects', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.btr}` })
@staticProps({
  entity: AUTOBASE.btr,
  listName: 'btrList',
  tableComponent: BatteryRegTable,
  formComponent: BatteryRegFormWrap,
  formMeta: tableMeta(),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class BatteryRegList extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('btr');
    flux.getActions('objects').getOrganizations();

    this.removeElementAction = flux.getActions('autobase').removeBattery;

  }
}
