import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import ElementsList from 'components/ElementsList.jsx';
import { FluxContext } from 'utils/decorators';

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

		this.mainListName = 'name';
		this.selectField = 'id';
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
		flux.getActions('objects').getModels();
    flux.getActions('objects').getFuelingWaterStations();
	}

	render() {

		const { fuelingWaterStations = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <FuelingWaterStationsTable data={fuelingWaterStations} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
				</FuelingWaterStationsTable>
			</div>
		);
	}
}

FuelingWaterStationsDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(FuelingWaterStationsDirectory, ['objects']);
