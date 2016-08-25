import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import ODHSupportStandardFormWrap from './ODHSupportStandardFormWrap.jsx';
import ODHSupportStandardsTable from './ODHSupportStandardsTable.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

@connectToStores(['odh'])
@staticProps({
  entity: 'odh_support_standard',
  listName: 'odhSupportStandardsList',
  tableComponent: ODHSupportStandardsTable,
  formComponent: ODHSupportStandardFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE']
})
export default class ODHSupportStandardsList extends ElementsList {

	constructor(props, context) {
		super(props);
    // DELETE пока не используется
    // this.removeElementAction = context.flux.getActions('employees').deleteODHSupportStandard;
	}

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('odh').getODHSupportStandards();
  }

}
