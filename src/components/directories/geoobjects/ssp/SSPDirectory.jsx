import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import SSPTable from './SSPTable.jsx';

@connectToStores(['geoObjects'])
@exportable({ path: 'geozones', entity: 'ssp' })
@staticProps({
  path: 'geozones',
  entity: 'ssp',
  listName: 'sspsList',
  tableComponent: SSPTable,
})
export default class SSPDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('ssp');
  }
}
