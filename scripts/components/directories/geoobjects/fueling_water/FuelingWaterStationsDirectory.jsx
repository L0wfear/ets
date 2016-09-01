import React, { Component } from 'react';
import FuelingWaterStationsTable from './FuelingWaterStationsTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['geoObjects'])
@staticProps({
  path: 'geozones',
  entity: 'fueling_water',
  listName: 'fuelingWaterStationsList',
  tableComponent: FuelingWaterStationsTable
})
@exportable
export default class FuelingWaterStationsDirectory extends ElementsList {

	constructor(props, context) {
		super(props);
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('fueling_water');
	}
}
