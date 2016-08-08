import React, { Component } from 'react';
import CarpoolTable from './CarpoolTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import ElementsList from 'components/ElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';

@connectToStores(['geoObjects'])
@staticProps({
  path: 'geozones',
  entity: 'carpool',
  listName: 'carpoolsList',
  tableComponent: CarpoolTable
})
@exportable
export default class CarpoolDirectory extends ElementsList {

	constructor(props, context) {
		super(props);
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('carpool');
	}
}
