import React from 'react';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import CarTypesTable from './CarTypesTable.jsx';
import schema from './CarTypesSchema.js';


@connectToStores(['objects'])
@exportable({ entity: 'types' })
@staticProps({
  entity: 'type',
  schema,
  listName: 'typesList',
  tableComponent: CarTypesTable,
})
export default class CarTypesDirectory extends ElementsList {

  componentDidMount() {
    const { flux } = this.context;
    flux.getActions('objects').getTypes();
  }

}
