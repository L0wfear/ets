import React, { Component } from 'react';
import CarpoolTable from './CarpoolTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['geoObjects'])
@exportable({ path: 'geozones', entity: 'carpool' })
@staticProps({
  path: 'geozones',
  entity: 'carpool',
  listName: 'carpoolsList',
  tableComponent: CarpoolTable,
})
export default class CarpoolDirectory extends ElementsList {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('carpool');
  }
}
