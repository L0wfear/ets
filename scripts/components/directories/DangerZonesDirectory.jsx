import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
// import SSPFormWrap from './ssp/SSPFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';

let tableMeta = {
	cols: [
		{
			name: 'id',
			caption: 'Номер',
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

let SSPTable = (props) => {

    const renderers = {

		};

		return <Table
				title='Особо опасные места'
				results={props.data}
				tableMeta={tableMeta}
				renderers={renderers}
				enumerated={false}
				{...props}/>
}

class SSPDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

		this.mainListName = 'name';
		this.selectField = 'id';
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
		flux.getActions('objects').getModels();
    flux.getActions('objects').getDangerZones();
	}

	render() {

		const { dangerZones = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <SSPTable data={dangerZones} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
				</SSPTable>
			</div>
		);
	}
}

SSPDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(SSPDirectory, ['objects']);
