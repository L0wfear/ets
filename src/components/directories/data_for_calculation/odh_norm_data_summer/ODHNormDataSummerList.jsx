import { connectToStores, staticProps } from 'utils/decorators';

import ElementsList from 'components/ElementsList';

import ODHNormDataSummerFormWrap from 'components/directories/data_for_calculation/odh_norm_data_summer/ODHNormDataSummerFormWrap';
import ODHNormDataSummerTable from 'components/directories/data_for_calculation/odh_norm_data_summer/ODHNormDataSummerTable';
import permissions from 'components/directories/data_for_calculation/odh_norm_data_summer/config-data/permissions';

@connectToStores(['odh'])
@staticProps({
  entity: 'odh_norm_data_summer',
  permissions,
  listName: 'odhNormDataSummerList',
  tableComponent: ODHNormDataSummerTable,
  formComponent: ODHNormDataSummerFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class ODHNormDataSummerList extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('odh').getODHNormDataSummer();
    flux.getActions('odh').getODHNorm();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

}
