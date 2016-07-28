import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import connectToStores from 'flummox/connect';
import ElementsList from 'components/ElementsList.jsx';

let tableMeta = {
	cols: [
		{
			name: 'address_comm',
			caption: 'Адрес',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'roadway_area',
			caption: 'Площадь на проезжей части, м²',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'sidewalk_area',
			caption: 'Площадь на тротуаре, м²',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'sidelines_area',
			caption: 'Площадь на обочинах, м²',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
	]
};

let DangerZonesTable = (props) => {

    const renderers = {

		};

		return <Table
				title='Особо опасные места'
				results={props.data}
				tableMeta={tableMeta}
				renderers={renderers}
				enumerated={true}
				{...props}/>
}

class DangerZonesDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

		this.mainListName = 'dangerZonesList';
		this.selectField = 'id';
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('danger_zone');
	}

	render() {

		const { dangerZonesList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <DangerZonesTable data={dangerZonesList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
				</DangerZonesTable>
			</div>
		);
	}
}

DangerZonesDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(DangerZonesDirectory, ['geoObjects']);
