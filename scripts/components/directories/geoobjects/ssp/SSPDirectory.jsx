import React, { Component } from 'react';
import SSPTable from './SSPTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['geoObjects'])
@staticProps({
  path: 'geozones',
  entity: 'ssp',
  listName: 'sspsList',
  tableComponent: SSPTable,
})
@exportable
export default class SSPDirectory extends ElementsList {

  constructor(props, context) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('ssp');
  }
}
