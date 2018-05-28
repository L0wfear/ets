import { connectToStores, staticProps, exportable } from 'utils/decorators';
import AUTOBASE from 'constants/autobase';
import ElementsList from 'components/ElementsList.jsx';
import TireModelFormWrap from 'components/directories/autobase/tire_model/TireModelFormWrap.jsx';
import TireModelTable from 'components/directories/autobase/tire_model/TireModelTable.tsx';
import permissions from 'components/directories/autobase/tire_model/config-data/permissions';

@connectToStores(['autobase', 'session'])
@exportable({ entity: `autobase/${AUTOBASE.tireModel}` })
@staticProps({
  entity: 'autobase_tire_model',
  listName: 'tireModelList',
  permissions,
  tableComponent: TireModelTable,
  formComponent: TireModelFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class TireBrandList extends ElementsList {
  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('autobase').removeTireModel;
  }
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('autobase').getAutobaseListByType('tireModel');
    flux.getActions('autobase').getAutobaseListByType('tireManufacturer');
  }
}
