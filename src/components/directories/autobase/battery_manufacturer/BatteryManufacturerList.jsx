import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import BatteryManufacturerFormWrap from './BatteryManufacturerFormWrap';
import BatteryManufacturerTable from './BatteryManufacturerTable';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.batteryManufacturer}` })
@staticProps({
  entity: 'autobase_battery_manufacturer',
  listName: 'batteryManufacturerList',
  tableComponent: BatteryManufacturerTable,
  formComponent: BatteryManufacturerFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class BatteryManufacturerList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeBatteryManufacturer;
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('batteryManufacturer');
  }
}
