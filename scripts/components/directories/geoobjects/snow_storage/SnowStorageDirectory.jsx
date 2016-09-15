import React, { Component } from 'react';
import SnowStorageTable from './SnowStorageTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['geoObjects'])
@staticProps({
  path: 'geozones',
  entity: 'snowStorage',
  listName: 'snowStoragesList',
  tableComponent: SnowStorageTable,
})
// @exportable
export default class SnowStorageDirectory extends ElementsList {

  constructor(props, context) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('snow_storage');
  }
}
