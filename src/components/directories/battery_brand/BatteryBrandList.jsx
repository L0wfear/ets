import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import BatteryBrandFormWrap from './BatteryBrandFormWrap.jsx';
import BatteryBrandTable from './BatteryBrandTable.jsx';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.batteryBrand}` })
@staticProps({
  entity: AUTOBASE.batteryBrand,
  listName: 'batteryBrandList',
  tableComponent: BatteryBrandTable,
  formComponent: BatteryBrandFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE'],
})
export default class BatteryBrandList extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('batteryBrand');
    flux.getActions('autobase').getAutobaseListByType('batteryManufacturer');
  }
}
