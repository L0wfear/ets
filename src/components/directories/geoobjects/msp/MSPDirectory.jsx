import React, { Component } from 'react';
import MSPTable, { tableMeta } from './MSPTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import GeoObjectsMapModal from '../GeoObjectsMapModal.jsx';
import schema from './schema';

@connectToStores(['geoObjects'])
@exportable({ path: 'geozones', entity: 'msp' })
@staticProps({
  path: 'geozones',
  entity: 'msp',
  schema,
  listName: 'mspsList',
  tableComponent: MSPTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta
})
export default class MSPDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('msp');
  }
}
