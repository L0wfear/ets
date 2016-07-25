import React, { Component } from 'react';
import { connectToStores, staticProps } from 'utils/decorators';
import OrganizationsTable from './OrganizationsTable.jsx';
import ElementsList from 'components/ElementsList.jsx';

@connectToStores(['objects'])
@staticProps({
	entity: 'organization',
	listName: 'organizations',
	tableComponent: OrganizationsTable
})
export default class OrganizationsDirectory extends ElementsList {

	constructor(props, context) {
		super(props);
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('objects').getOrganizations();
	}
	
}
