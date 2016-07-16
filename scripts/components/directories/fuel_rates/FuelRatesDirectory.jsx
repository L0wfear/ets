import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import moment from 'moment';
import connectToStores from 'flummox/connect';
import FuelRateFormWrap from './FuelRateFormWrap.jsx';
import ElementsList from 'components/ElementsList.jsx';
import { getFuelOperationById, getModelById } from 'utils/labelFunctions';

let tableMeta = {
	cols: [
		{
			name: 'order_date',
			caption: 'Дата приказа',
			type: 'date',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'operation_id',
			caption: 'Операция',
			type: 'number',
      filter: {
        type: 'select',
        labelFunction: (operation_id) => getFuelOperationById(operation_id).name,
      }
		},
		{
			name: 'summer_rate',
			caption: 'Норма для летнего периода',
			type: 'number',
		},
    {
			name: 'winter_rate',
			caption: 'Норма для зимнего периода',
			type: 'number',
		},
		{
			name: 'car_special_model_name',
			caption: 'Модель ТС',
			type: 'string',
			filter: {
        type: 'select'
      }
		},
		{
			name: 'car_model_name',
			caption: 'Марка шасси',
			type: 'number',
      filter: {
        type: 'select'
      }
		},
	]
};

let FuelRatesTable = (props) => {

    const renderers = {
      operation_id: ({data}) => <div>{getFuelOperationById(data).name}</div>,
      order_date: ({data}) => <div>{moment(data).format(global.APP_DATE_FORMAT)}</div>
    };

		return <Table title='Нормы расхода топлива'
									results={props.data}
									tableMeta={tableMeta}
                  renderers={renderers}
									{...props}/>
}

class FuelRatesDirectory extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('fuelRates').deleteFuelRate;
    this.mainListName = 'rates';
	}

	componentDidMount() {
		super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('fuelRates').getFuelOperations();
		flux.getActions('fuelRates').getFuelRates();
	}

	render() {

		const { rates = [] } = this.props;

		return (
			<div className="ets-page-wrap">
        <FuelRatesTable data={rates} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus"/> Добавить</Button>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="pencil" /> Изменить</Button>
					<Button bsSize="small" disabled={this.state.selectedElement === null} onClick={this.removeElement.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</FuelRatesTable>
        <FuelRateFormWrap onFormHide={this.onFormHide.bind(this)}
  												showForm={this.state.showForm}
  												element={this.state.selectedElement}/>
			</div>
		);
	}
}

FuelRatesDirectory.contextTypes = {
  flux: React.PropTypes.object,
};

export default connectToStores(FuelRatesDirectory, ['fuel-rates', 'objects']);
