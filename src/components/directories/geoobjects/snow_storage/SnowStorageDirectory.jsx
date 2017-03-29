import React, { Component } from 'react';
import SnowStorageTable, { tableMeta } from './SnowStorageTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import GeoObjectsMapModal from '../GeoObjectsMapModal.jsx';

@connectToStores(['geoObjects', 'session'])
@staticProps({
  path: 'geozones',
  entity: 'snow_storage',
  listName: 'snowStoragesList',
  tableComponent: SnowStorageTable,
  formComponent: GeoObjectsMapModal,
  formMeta: tableMeta(),
})
// @exportable
export default class SnowStorageDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('snow_storage');
  }
}
