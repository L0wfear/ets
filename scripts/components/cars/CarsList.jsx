import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import CarFormWrap from './CarFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';
import { waybillStatusLabelFunction } from 'utils/labelFunctions';

let getCondition = (data) => {
	return parseInt(data) > 0 ? 'Исправно' : 'Неисправно';
};

let tableMeta = {
	cols: [
		{
			name: 'gov_number',
			caption: 'Госномер',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'special_model_name',
			caption: 'Модель ТС',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'model_name',
			caption: 'Марка шасси ТС',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'type',
			caption: 'Тип',
			type: 'text',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'condition',
			caption: 'Состояние',
			type: 'text',
			filter: {
				type: 'select',
        labelFunction: (i) => i > 0 ? 'Исправно' : 'Неисправно'
			}
		},
		{
			name: 'garage_number',
			caption: 'Гаражный номер',
			type: 'text',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'fuel_correction_rate',
			caption: 'Поправочный коэффициент',
			type: 'number',
			filter: {
				type: 'select',
			},
		},
		{
			name: 'company_structure_name',
			caption: 'Подразделение предприятия',
			type: 'text',
			filter: {
				type: 'select',
			},
		}
	]
}

let CarsTable = (props) => {

	const renderers = {
		condition: ({data}) => <div>{getCondition(data)}</div>,
		fuel_correction_rate: ({data}) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
		garage_number: ({data}) => <div>{data && data !== 'null' ? data : ''}</div>
	};

	return <Table title='Реестр транспорта'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								{...props} />

}

class CarsList extends ElementsList {

	constructor(props) {
		super(props);
		this.mainListName = 'carsList';
		this.selectField = 'asuods_id';
	}

	async componentDidMount() {
		const { flux } = this.context;

		await flux.getActions('objects').getTypes();
		flux.getActions('objects').getCars();
		flux.getActions('objects').getOwners();
	}

	render() {

		const { carsList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<CarsTable data={carsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'asuods_id'}>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="pencil" /> Редактировать</Button>
				</CarsTable>
				<CarFormWrap onFormHide={this.onFormHide.bind(this)}
												showForm={this.state.showForm}
												element={this.state.selectedElement}/>
			</div>
		);
	}
}

CarsList.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(CarsList, ['objects']);
