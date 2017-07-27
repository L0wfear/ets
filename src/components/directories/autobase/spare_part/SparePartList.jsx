import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import SparePartTable from './SparePartTable.jsx';
import SparePartFormWrap from './SparePartFormWrap';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.sparePart}` })
@staticProps({
  entity: 'autobase_spare_part',
  listName: 'sparePartList',
  formComponent: SparePartFormWrap,
  tableComponent: SparePartTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class SparePartList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeSparePart;
  }
  componentDidMount() {
    super.componentDidMount();

    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('sparePart');
    flux.getActions('autobase').getAutobaseListByType('measureUnit');
    flux.getActions('autobase').getAutobaseListByType('sparePartGroup');

  }
}
