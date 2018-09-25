import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList';
import BatteryManufacturerFormWrap from 'components/directories/autobase/battery_manufacturer/BatteryManufacturerFormWrap';
import BatteryManufacturerTable from 'components/directories/autobase/battery_manufacturer/BatteryManufacturerTable';
import permissions from 'components/directories/autobase/battery_manufacturer/config-data/permissions';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.batteryManufacturer}` })
@staticProps({
  entity: 'autobase_battery_manufacturer',
  permissions,
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
