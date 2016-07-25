import React, { Component } from 'react';
import MSPTable from './MSPTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

@connectToStores(['geoObjects'])
@staticProps({
	entity: 'msp',
	listName: 'mspsList',
	tableComponent: MSPTable
})
export default class MSPDirectory extends ElementsList {

	constructor(props, context) {
		super(props);
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('msp');
	}
}
