import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import BatteryBrandFormWrap from './BatteryBrandFormWrap.jsx';
import BatteryBrandTable from './BatteryBrandTable.tsx';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.batteryBrand}` })
@staticProps({
  entity: 'autobase_battery_brand',
  listName: 'batteryBrandList',
  tableComponent: BatteryBrandTable,
  formComponent: BatteryBrandFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class BatteryBrandList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeBatteryBrand;
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('batteryBrand');
    flux.getActions('autobase').getAutobaseListByType('batteryManufacturer');
  }
}
