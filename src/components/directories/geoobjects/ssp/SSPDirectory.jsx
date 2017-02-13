import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import SSPTable, { tableMeta } from './SSPTable.jsx';
import GeoObjectsMapModal from '../GeoObjectsMapModal.jsx';
import schema from './schema';

@connectToStores(['geoObjects'])
@exportable({ path: 'geozones', entity: 'ssp' })
@staticProps({
  path: 'geozones',
  entity: 'ssp',
  schema,
  listName: 'sspsList',
  tableComponent: SSPTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta
})
export default class SSPDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('ssp');
  }
}
