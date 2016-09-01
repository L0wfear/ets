import React, { Component } from 'react';
import { connectToStores, staticProps } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import CarFormWrap from './CarFormWrap.jsx';
import CarsTable from './CarsTable.jsx';

@connectToStores(['objects'])
@staticProps({
	entity: 'car',
	listName: 'carsList',
	selectField: 'asuods_id',
	tableComponent: CarsTable,
	formComponent: CarFormWrap,
	operations: ['LIST', 'READ', 'UPDATE']
})
export default class CarsList extends ElementsList {

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		super.componentDidMount();
		const { flux } = this.context;

		await flux.getActions('objects').getTypes();
		flux.getActions('objects').getCars();
	}
}
