import React, { Component } from 'react';
import FuelRateFormWrap from './FuelRateFormWrap.jsx';
import FuelRatesTable from './FuelRatesTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

@connectToStores(['fuelRates', 'objects'])
@staticProps({
  entity: 'fuel_consumption_rate',
  listName: 'rates',
  tableComponent: FuelRatesTable,
  formComponent: FuelRateFormWrap,
  operations: ['CREATE', 'READ', 'UPDATE', 'DELETE'],
})
export default class FuelRatesDirectory extends ElementsList {

  constructor(props, context) {
    super(props);
    this.removeElementAction = context.flux.getActions('fuelRates').deleteFuelRate;
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('fuelRates').getFuelOperations();
    flux.getActions('fuelRates').getFuelRates();
  }
}
