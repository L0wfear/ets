import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import PGMTable from './PGMTable.jsx';
import GeoObjectsMapModal from '../GeoObjectsMapModal.jsx';

@connectToStores(['geoObjects'])
@staticProps({
  path: 'geozones',
  entity: 'pgm',
  listName: 'pgmsList',
  tableComponent: PGMTable,
  formComponent: GeoObjectsMapModal
})
// @exportable
export default class PGMDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('pgm_store');
  }
}
