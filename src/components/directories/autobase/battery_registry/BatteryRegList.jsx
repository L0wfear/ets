import { connectToStores, staticProps, exportable } from 'utils/decorators';

import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import BatteryRegFormWrap from 'components/directories/autobase/battery_registry/BatteryRegFormWrap.jsx';
import BatteryRegTable from 'components/directories/autobase/battery_registry/BatteryRegTable.jsx';
import permissions from 'components/directories/autobase/battery_registry/config-data/permissions';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.batteryRegistry}` })
@staticProps({
  entity: 'autobase_battery',
  permissions,
  listName: 'batteryRegistryList',
  tableComponent: BatteryRegTable,
  formComponent: BatteryRegFormWrap,
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
  }
}
