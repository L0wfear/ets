import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import TireFormWrap from './TireFormWrap.jsx';
import TireTable from './TireTable.jsx';

@connectToStores(['autobase', 'objects', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.tire}` })
@staticProps({
  entity: 'autobase_tire',
  listName: 'tireList',
  tableComponent: TireTable,
  formComponent: TireFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class TireList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeDataFromDB.bind(null, 'tire');
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('tire');
    flux.getActions('autobase').getAutobaseListByType('tireSize');
    flux.getActions('autobase').getAutobaseListByType('tireModel');
    flux.getActions('objects').getOrganizations();
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
