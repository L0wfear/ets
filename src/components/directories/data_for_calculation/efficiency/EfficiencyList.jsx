import ElementsList from 'components/ElementsList';
import EfficiencyFormWrap from 'components/directories/data_for_calculation/efficiency/EfficiencyFormWrap';
import EfficiencyTable from 'components/directories/data_for_calculation/efficiency/EfficiencyTable';
import { connectToStores, staticProps } from 'utils/decorators';
import permissions from 'components/directories/data_for_calculation/efficiency/config-data/permissions';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

@connectToStores(['odh', 'objects'])
@staticProps({
  entity: 'efficiency',
  permissions,
  listName: 'efficiencyList',
  tableComponent: EfficiencyTable,
  formComponent: EfficiencyFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class EfficiencyList extends ElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('odh').deleteEfficiency;
  }

  init() {
    const { flux } = this.context;
    flux.getActions('odh').getEfficiency();
  }
}

export default compose(
  connect(
    state => ({
      userData: getSessionState(state).userData,
    }),
  ),
)(EfficiencyList);
