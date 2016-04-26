import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import moment from 'moment';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import ElementsList from '../ElementsList.jsx';

let tableMeta = {
	cols: [
		{
			name: 'full_name',
			caption: 'Полное наименование',
			type: 'string',
      filter: {
        type: 'input',
      },
			cssClassName: 'width300'
		},
		{
			name: 'short_name',
			caption: 'Краткое наименование',
			type: 'string',
      filter: {
        type: 'input',
      },
			cssClassName: 'width300'
		},
		{
			name: 'plow_width',
			caption: 'Ширина уборочного оборудования',
			type: 'string',
      filter: false
		}
	]
};

let CarTypesTable = (props) => {

    const renderers = {};

		return <Table title='Типы техники'
									results={props.data}
									tableMeta={tableMeta}
                  renderers={renderers}
									{...props}/>
}

class CarTypesDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

		this.mainListName = 'typesList';
		this.selectField = 'id';
	}

	componentDidMount() {
    const { flux } = this.context;
		flux.getActions('objects').getTypes();
	}

	render() {

		const { typesList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <CarTypesTable data={typesList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'} />
			</div>
		);
	}
}

CarTypesDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(CarTypesDirectory, ['objects']);
