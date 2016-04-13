import React, { Component } from 'react';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import cx from 'classnames';
import connectToStores from 'flummox/connect';
import FuelOperationFormWrap from './FuelOperationFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';

let tableMeta = {
	cols: [
		{
			name: 'name',
			caption: 'Операция',
			type: 'number',
      filter: {
        type: 'select',
      }
		}
	]
};

let FuelOperationsTable = (props) => {

    const renderers = {};

		return <Table title='Операции для расчета топлива'
									results={props.data}
									tableMeta={tableMeta}
                  renderers={renderers}
									{...props}/>
}

class FuelOperationsDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

		this.mainListName = 'operations';
		this.selectField = 'id';
		this.removeElementAction = context.flux.getActions('fuel-rates').deleteFuelOperation;
	}

	componentDidMount() {
    const { flux } = this.context;
		flux.getActions('objects').getModels();
    flux.getActions('fuel-rates').getFuelOperations();
	}

	render() {

		const { operations = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <FuelOperationsTable data={operations} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Добавить</Button>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="pencil" /> Изменить</Button>
					<Button bsSize="small" disabled={this.state.selectedElement === null} onClick={this.removeElement.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</FuelOperationsTable>
        <FuelOperationFormWrap onFormHide={this.onFormHide.bind(this)}
															 showForm={this.state.showForm}
															 element={this.state.selectedElement} />
			</div>
		);
	}
}

FuelOperationsDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(FuelOperationsDirectory, ['fuel-rates', 'objects']);
