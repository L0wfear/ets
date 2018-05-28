import ElementsList from 'components/ElementsList.jsx';
import ODHNormFormWrap from 'components/directories/data_for_calculation/odh_norm/ODHNormFormWrap.jsx';
import ODHNormTable from 'components/directories/data_for_calculation/odh_norm/ODHNormTable.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import permissions from 'components/directories/data_for_calculation/odh_norm/config-data/permissions';

@connectToStores(['odh'])
@exportable({ entity: 'consumable_material' })
@staticProps({
  entity: 'odh_norm',
  permissions,
  listName: 'odhNormList',
  tableComponent: ODHNormTable,
  formComponent: ODHNormFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class ODHNormList extends ElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('odh').deleteODHNorm;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('odh').getODHNorm();
    flux.getActions('odh').getMeasureUnits();
  }

}
