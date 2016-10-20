import React, { Component } from 'react';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import FuelingWaterStationsTable from './FuelingWaterStationsTable.jsx';
import GeoObjectsMapModal from '../GeoObjectsMapModal.jsx';

@connectToStores(['geoObjects'])
@exportable({ path: 'geozones', entity: 'fueling_water' })
@staticProps({
  path: 'geozones',
  entity: 'fueling_water',
  listName: 'fuelingWaterStationsList',
  tableComponent: FuelingWaterStationsTable,
  formComponent: GeoObjectsMapModal
})
export default class FuelingWaterStationsDirectory extends ElementsList {
  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('fueling_water');
  }
}
