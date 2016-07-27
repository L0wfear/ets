import React, { Component } from 'react';
import { connectToStores, staticProps } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import OdhCoverageReportTable from './OdhCoverageReportTable.jsx';

@connectToStores(['reports'])
@staticProps({
	listName: 'odhCoverageReport',
	tableComponent: OdhCoverageReportTable,
	operations: ['LIST']
})
export default class OdhCoverageReport extends ElementsList {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		super.componentDidMount();
		const { flux } = this.context;
    flux.getActions('reports').getOdhCoverageReport();
	}
}
