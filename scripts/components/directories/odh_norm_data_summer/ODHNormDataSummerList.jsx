import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import ODHNormDataSummerFormWrap from './ODHNormDataSummerFormWrap.jsx';
import ODHNormDataSummerTable from './ODHNormDataSummerTable.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

@connectToStores(['odh'])
@staticProps({
  entity: 'odh_norm_data_summer',
  listName: 'odhNormDataSummerList',
  tableComponent: ODHNormDataSummerTable,
  formComponent: ODHNormDataSummerFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class ODHNormDataSummerList extends ElementsList {

  constructor(props, context) {
    super(props);
    // DELETE пока не используется
    // this.removeElementAction = context.flux.getActions('employees').deleteODHNorm;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('odh').getODHNormDataSummer();
    flux.getActions('odh').getODHNorm();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

}
