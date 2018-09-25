import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList';
import BatteryBrandFormWrap from 'components/directories/autobase/battery_brand/BatteryBrandFormWrap';
import BatteryBrandTable from 'components/directories/autobase/battery_brand/BatteryBrandTable';
import permissions from 'components/directories/autobase/battery_brand/config-data/permissions';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.batteryBrand}` })
@staticProps({
  entity: 'autobase_battery_brand',
  permissions,
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
  }
}
