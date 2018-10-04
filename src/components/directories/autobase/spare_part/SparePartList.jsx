import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList';
import SparePartTable from 'components/directories/autobase/spare_part/SparePartTable';
import SparePartFormWrap from 'components/directories/autobase/spare_part/SparePartFormWrap';
import permissions from 'components/directories/autobase/spare_part/config-data/permissions';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.sparePart}` })
@staticProps({
  entity: 'autobase_spare_part',
  permissions,
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
  init() {
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('sparePart');
  }
}
