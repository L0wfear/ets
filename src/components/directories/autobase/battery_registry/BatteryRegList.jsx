import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import BatteryRegFormWrap from './BatteryRegFormWrap.jsx';
import BatteryRegTable, { tableMeta } from './BatteryRegTable.jsx';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.batteryRegistry}` })
@staticProps({
  entity: 'autobase_battery',
  listName: 'batteryRegistryList',
  tableComponent: BatteryRegTable,
  formComponent: BatteryRegFormWrap,
  formMeta: tableMeta(),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class BatteryRegList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeBatteryRegistry;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('batteryRegistry');
    flux.getActions('autobase').getAutobaseListByType('batteryBrand');
    flux.getActions('autobase').getAutobaseListByType('batteryManufacturer');
  }
}
