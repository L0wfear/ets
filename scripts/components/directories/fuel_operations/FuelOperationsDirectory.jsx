import React from 'react';
import FuelOperationFormWrap from './FuelOperationFormWrap.jsx';
import FuelOperationsTable from './FuelOperationsTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

@connectToStores(['fuelRates', 'objects'])
@staticProps({
	entity: 'fuel_operation',
	listName: 'operations',
	tableComponent: FuelOperationsTable,
	formComponent: FuelOperationFormWrap,
	operations: ['CREATE', 'READ', 'UPDATE', 'DELETE']
})
export default class FuelOperationsDirectory extends ElementsList {

	constructor(props, context) {
		super(props);
		this.removeElementAction = context.flux.getActions('fuelRates').deleteFuelOperation;
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('fuelRates').getFuelOperations();
	}
}
