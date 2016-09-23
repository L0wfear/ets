import React from 'react';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps } from 'utils/decorators';
import CarTypesTable from './CarTypesTable.jsx';

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
