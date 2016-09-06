import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import EfficiencyFormWrap from './EfficiencyFormWrap.jsx';
import EfficiencyTable from './EfficiencyTable.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

@connectToStores(['odh', 'objects'])
@staticProps({
  entity: 'efficiency',
  listName: 'efficiencyList',
  tableComponent: EfficiencyTable,
  formComponent: EfficiencyFormWrap,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE']
})
export default class EfficiencyList extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('odh').deleteEfficiency;
	}

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('odh').getEfficiency();
    flux.getActions('odh').getODHNorm();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

}
