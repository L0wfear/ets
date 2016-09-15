import React, { Component } from 'react';
import CarTypesTable from './CarTypesTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';

@connectToStores(['objects'])
@staticProps({
  entity: 'type',
  listName: 'typesList',
  tableComponent: CarTypesTable,
})
export default class CarTypesDirectory extends ElementsList {

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getTypes();
  }

}
