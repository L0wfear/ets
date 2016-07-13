import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import cx from 'classnames';
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

let CarpoolTable = (props) => {

    const renderers = {

		};

		return <Table
				title='Автобазы'
				results={props.data}
				tableMeta={tableMeta}
				renderers={renderers}
				{...props}/>
}

class CarpoolDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

		this.mainListName = 'name';
		this.selectField = 'id';
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
		flux.getActions('objects').getModels();
    flux.getActions('objects').getCarpools();
	}

	render() {

		const { carpools = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <CarpoolTable data={carpools} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
				</CarpoolTable>
			</div>
		);
	}
}

CarpoolDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(CarpoolDirectory, ['objects']);
