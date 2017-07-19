import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import SparePartTable from './SparePartTable.jsx';
import SparePartFormWrap from './SparePartFormWrap';

@connectToStores(['autobase', 'objects', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.sparePart}` })
@staticProps({
  entity: AUTOBASE.sparePart,
  listName: 'sparePartList',
  formComponent: SparePartFormWrap,
  tableComponent: SparePartTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class SparePartList extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('sparePart');

    this.removeElementAction = flux.getActions('autobase').deleteLineFromSarePart;
  }
}
