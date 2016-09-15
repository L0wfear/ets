import React, { Component } from 'react';
import PGMTable from './PGMTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['geoObjects'])
@staticProps({
  path: 'geozones',
  entity: 'pgm',
  listName: 'pgmsList',
  tableComponent: PGMTable,
})
// @exportable
export default class PGMDirectory extends ElementsList {

  constructor(props, context) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('pgm_store');
  }
}
