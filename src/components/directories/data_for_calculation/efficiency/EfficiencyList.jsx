import ElementsList from 'components/ElementsList.jsx';
import EfficiencyFormWrap from 'components/directories/data_for_calculation/efficiency/EfficiencyFormWrap.jsx';
import EfficiencyTable from 'components/directories/data_for_calculation/efficiency/EfficiencyTable.jsx';
import { connectToStores, staticProps } from 'utils/decorators';
import permissions from 'components/directories/data_for_calculation/efficiency/config-data/permissions';

@connectToStores(['odh', 'objects'])
@staticProps({
  entity: 'efficiency',
  permissions,
  listName: 'efficiencyList',
  tableComponent: EfficiencyTable,
  formComponent: EfficiencyFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class EfficiencyList extends ElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('odh').deleteEfficiency;
  }

  async componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    await flux.getActions('odh').getEfficiency();
  }

}
