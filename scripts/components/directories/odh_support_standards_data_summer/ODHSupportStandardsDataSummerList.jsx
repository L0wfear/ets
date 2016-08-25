import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import ODHSupportStandardDataSummerFormWrap from './ODHSupportStandardDataSummerFormWrap.jsx';
import ODHSupportStandardsDataSummerTable from './ODHSupportStandardsDataSummerTable.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

@connectToStores(['odh'])
@staticProps({
  entity: 'odh_support_standard_data_summer',
  listName: 'odhSupportStandardsDataSummerList',
  tableComponent: ODHSupportStandardsDataSummerTable,
  formComponent: ODHSupportStandardDataSummerFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE']
})
export default class ODHSupportStandardsDataSummerList extends ElementsList {

	constructor(props, context) {
		super(props);
    // DELETE пока не используется
    // this.removeElementAction = context.flux.getActions('employees').deleteODHSupportStandard;
	}

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('odh').getODHSupportStandardsDataSummer();
    flux.getActions('odh').getODHSupportStandards();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

}
