import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList';
import TireFormWrap from 'components/directories/autobase/tire/TireFormWrap';
import TireTable from 'components/directories/autobase/tire/TireTable';
import permissions from 'components/directories/autobase/tire/config-data/permissions';

@connectToStores(['autobase', 'objects', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.tire}` })
@staticProps({
  entity: 'autobase_tire',
  permissions,
  listName: 'tireList',
  tableComponent: TireTable,
  formComponent: TireFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class TireList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeTire;
  }
  init() {
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('tire');
  }
  handleCloneClick = (tireId) => {
    this.context.flux.getActions('autobase').cloneTire(tireId);
  }
  getAdditionalProps() {
    return {
      onCloneClick: this.handleCloneClick,
    };
  }
}
