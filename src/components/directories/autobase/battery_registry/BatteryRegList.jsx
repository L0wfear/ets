import ElementsList from 'components/ElementsList.jsx';
import BatteryRegTable, { tableMeta } from './BatteryRegTable.jsx';
import BatteryRegFormWrap from './BatteryRegFormWrap.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE_NAME from 'constants/autobase.js';

@connectToStores(['autobase', 'objects', 'session'])
@exportable({ entity: `autobase/${AUTOBASE_NAME.btr}` })
@staticProps({
  entity: AUTOBASE_NAME.btr,
  listName: 'btrList',
  formComponent: BatteryRegFormWrap,
  tableComponent: BatteryRegTable,
  formMeta: tableMeta(),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE'],
})
export default class BatteryRegList extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('btr');
    flux.getActions('objects').getOrganizations();
  }
}
