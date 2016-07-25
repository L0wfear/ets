import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import connectToStores from 'flummox/connect';
import ElementsList from 'components/ElementsList.jsx';

let tableMeta = {
	cols: [
		{
			name: 'name',
			caption: 'Полное наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'address',
			caption: 'Адрес',
			type: 'string',
      filter: {
        type: 'select',
      }
		}
	]
};

let FuelingWaterStationsTable = (props) => {

    const renderers = {

		};

		return <Table
				title='Пункты заправки водой'
				results={props.data}
				tableMeta={tableMeta}
				renderers={renderers}
				{...props}/>
}

class FuelingWaterStationsDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

		this.mainListName = 'fuelingWaterStationsList';
		this.selectField = 'id';
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('geoObjects').getGeozoneByType('fueling_water');
	}

	render() {

		const { fuelingWaterStationsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <FuelingWaterStationsTable data={fuelingWaterStationsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
				</FuelingWaterStationsTable>
			</div>
		);
	}
}

export default connectToStores(FuelingWaterStationsDirectory, ['geoObjects']);
