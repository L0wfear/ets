import { connectToStores, staticProps } from 'utils/decorators';

import ElementsList from 'components/ElementsList.jsx';

import ODHNormDataSummerFormWrap from 'components/directories/odh_norm_data_summer/ODHNormDataSummerFormWrap.jsx';
import ODHNormDataSummerTable from 'components/directories/odh_norm_data_summer/ODHNormDataSummerTable.jsx';

@connectToStores(['odh'])
@staticProps({
  entity: 'odh_norm_data_summer',
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
