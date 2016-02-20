import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import connectToStores from 'flummox/connect';
import { Button, Glyphicon } from 'react-bootstrap';
import Table from '../ui/table/DataTable.jsx';
import DateFormatter from '../ui/DateFormatter.jsx';
import WaybillFormWrap from './WaybillFormWrap.jsx';
import ElementsList from '../ElementsList.jsx';
import moment from 'moment';
import cx from 'classnames';

function getFIOById(id) {
	let result = '';
	const { flux } = window.__ETS_CONTAINER__;
  const employeesStore = flux.getStore('employees');
	const employee = employeesStore.getEmployeeById(id);
	if (employee) {
		if (employee.last_name && employee.first_name && employee.middle_name)
		result = employee.last_name + ' ' + employee.first_name[0]+ '.' + employee.middle_name[0] + '.';
	}

	return result;
}

let getCarById = (id) => {
  const { flux } = window.__ETS_CONTAINER__;
  const objectsStore = flux.getStore('objects');
	const car = objectsStore.getCarById(id);
	if (car.gov_number && car.model) {
		car.label = car.gov_number + ' [' + car.model + ']';
	}
	return car;
};

function getStatusLabel(s) {
	switch (s) {
		case 'draft':
			return 'Черновик';
		case 'active':
			return 'Активен';
		case 'closed':
			return 'Закрыт';
		default:
			return 'Н/Д';
	}
}

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'status',
				caption: 'Статус',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: getStatusLabel
				}
			},
			{
				name: 'number',
				caption: 'Номер',
				type: 'number',
			},
			{
				name: 'date_create',
				caption: 'Дата выдачи',
				type: 'date',
				filter: {
					type: 'select',
				}
			},
			{
				name: 'driver_id',
				caption: 'Водитель',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: (id) => getFIOById(id),
				}
			},
			{
				name: 'car_id',
				caption: 'Гос. № ТС',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: (id) => getCarById(id).gov_number,
				}
			},
			{
				name: 'fact_departure_date',
				caption: 'Выезд факт',
				type: 'date',
				filter: {
					type: 'select',
				}
			},
			{
				name: 'fact_arrival_date',
				caption: 'Возвращение факт',
				type: 'date',
				filter: {
					type: 'select',
				}
			},
			{
				name: 'responsible_person_id',
				caption: 'Мастер',
				type: 'string',
				filter: {
					type: 'select',
					labelFunction: (id) => getFIOById(id),
				}
			},
		]
	};

	return tableMeta;

};


let WaybillsTable = (props) => {

		let { carsIndex = {} } = props;
		const renderers = {
			status: ({data}) => <div>{getStatusLabel(data)}</div>,
			responsible_person_id: ({data}) => <div>{getFIOById(data)}</div>,
			driver_id: ({data}) => <div>{getFIOById(data)}</div>,
			car_id: ({data}) => <div>{getCarById(data).gov_number}</div>,
			date_create: ({data}) => <DateFormatter date={data} />,
			fact_departure_date: ({data}) => <DateFormatter date={data} time={true} />,
			fact_arrival_date: ({data}) => <DateFormatter date={data} time={true} />,
		};

		return <Table title="Журнал путевых листов"
									results={props.data}
									renderers={renderers}
									initialSort={'number'}
									initialSortAscending={false}
									tableMeta={getTableMeta(props)}
									{...props}/>
}

class WaybillJournal extends ElementsList {

	constructor(props, context) {
		super(props);

    this.removeElementAction = context.flux.getActions('waybills').delete;
    this.mainListName = 'waybillsList';
	}

	init() {
		const { flux } = this.context;
		flux.getActions('waybills').get();
		flux.getActions('employees').getEmployees();
		flux.getActions('objects').getTechOperations();
		flux.getActions('objects').getFuelTypes();
		flux.getActions('objects').getCars();
	}

	render() {

		const { waybillsList = [] } = this.props;

		let showCloseBtn = this.state.selectedElement !== null && this.state.selectedElement.status !== 'active';

		return (
			<div className="ets-page-wrap">
				<WaybillsTable data={waybillsList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'} filterValues={this.props.location.query} {...this.props}>
					<Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать ПЛ</Button>
					<Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="search" /> Просмотреть ПЛ</Button>
					<Button bsSize="small" disabled={showCloseBtn} onClick={this.showForm.bind(this)}><Glyphicon glyph="ok" /> Закрыть ПЛ</Button>
					<Button bsSize="small" disabled={this.state.selectedElement === null} onClick={this.removeElement.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
				</WaybillsTable>
				<WaybillFormWrap onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 element={this.state.selectedElement}
												 {...this.props}/>
			</div>
		);
	}
}

export default connectToStores(WaybillJournal, ['waybills', 'objects', 'employees']);
