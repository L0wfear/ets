import { connectToStores, staticProps } from 'utils/decorators';

import ElementsList from 'components/ElementsList';

import ODHNormDataSummerFormWrap from 'components/directories/data_for_calculation/odh_norm_data_summer/ODHNormDataSummerFormWrap';
import ODHNormDataSummerTable from 'components/directories/data_for_calculation/odh_norm_data_summer/ODHNormDataSummerTable';
import permissions from 'components/directories/data_for_calculation/odh_norm_data_summer/config-data/permissions';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { getSessionState } from 'redux-main/reducers/selectors';

@connectToStores(['odh'])
@staticProps({
  entity: 'odh_norm_data_summer',
  permissions,
  listName: 'odhNormDataSummerList',
  tableComponent: ODHNormDataSummerTable,
  formComponent: ODHNormDataSummerFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
class ODHNormDataSummerList extends ElementsList {
  init() {
    const { flux } = this.context;
    flux.getActions('odh').getODHNormDataSummer();
    flux.getActions('odh').getODHNorm();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }
}

export default compose(
  connect(
    state => ({
      userData: getSessionState(state).userData,
    }),
  ),
)(ODHNormDataSummerList);
