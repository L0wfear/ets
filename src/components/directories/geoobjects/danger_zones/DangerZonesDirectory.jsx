import React, { Component } from 'react';
import DangerZonesTable from './DangerZonesTable.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import GeoObjectsMapModal from '../GeoObjectsMapModal.jsx';


@connectToStores(['geoObjects'])
@exportable({ path: 'geozones', entity: 'danger_zone' })
@staticProps({
  path: 'geozones',
  entity: 'danger_zone',
  listName: 'dangerZonesList',
  tableComponent: DangerZonesTable,
  formComponent: GeoObjectsMapModal,
})
export default class DangerZonesDirectory extends ElementsList {

  constructor(props, context) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('danger_zone');
  }
}
