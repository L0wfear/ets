import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
// import PZVFormWrap from './ssp/PZVFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';

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

let PZVTable = (props) => {

    const renderers = {

		};

		return <Table
				title='Пункты заправки водой'
				results={props.data}
				tableMeta={tableMeta}
				renderers={renderers}
				{...props}/>
}

class PZVDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

		this.mainListName = 'name';
		this.selectField = 'id';
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
		flux.getActions('objects').getModels();
    flux.getActions('objects').getPZVs();
	}

	render() {

		const { pzvs = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <PZVTable data={pzvs} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
				</PZVTable>
			</div>
		);
	}
}

PZVDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(PZVDirectory, ['objects']);
