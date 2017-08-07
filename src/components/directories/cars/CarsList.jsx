import React from 'react';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import ElementsList from 'components/ElementsList.jsx';
import CarFormWrap from './CarFormWrap.jsx';
import CarsTable from './CarsTable.tsx';
import schema from './CarSchema.js';

@connectToStores(['objects', 'session'])
@exportable({ entity: 'car_actual' })
@staticProps({
  entity: 'car',
  listName: 'carsList',
  schema,
  selectField: 'asuods_id',
  tableComponent: CarsTable,
  formComponent: CarFormWrap,
  operations: ['LIST', 'READ', 'UPDATE'],
})
export default class CarsList extends ElementsList {
  async componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;

    await flux.getActions('objects').getTypes();
    flux.getActions('objects').getCars();
  }
}
