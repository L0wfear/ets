import React, { Component } from 'react';
import DangerZonesTable from './DangerZonesTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['geoObjects'])
@staticProps({
  path: 'geozones',
  entity: 'danger_zone',
  listName: 'dangerZonesList',
  tableComponent: DangerZonesTable
})
@exportable
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
