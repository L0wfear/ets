import React, { Component } from 'react';
import { Link } from 'react-router';
//import Modal from './ui/Modal.jsx';
//import Table from './ui/table/Table.jsx';
import Table from './ui/table/DataTable.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import WaybillForm from './WaybillForm.jsx';
import {makeDate, makeTime} from '../utils/dates.js';
import moment from 'moment';
import { getCarById } from '../../mocks/krylatskoe_cars.js';

import WaybillFormWrap from './WaybillFormWrap.jsx';
import { getList, getLastNumber, createBill, getBillById, updateBill, deleteBill } from '../stores/WaybillStore.js';
import { getFIOById } from '../stores/EmployeesStore.js';


let fakeData = getList();

export default class WaybillJournal extends Component {


	constructor(props) {
		super(props);
		this.state = {
			selectedBill: null
		}

		window.updateBillsJournal = this.updateTable.bind(this);
	}

	selectBill({props}) {
		const id = props.data.ID;
		let bill = getBillById(id);

		this.setState({
			selectedBill: bill
		})
	}

	createBill() {
		this.setState({
			showForm: true,
			selectedBill: null
		})
	}

	onFormHide() {
		this.setState({
			showForm: false,
		//	selectedBill: null
		})

		fakeData = getList();
	}

	componentDidMount() {
		fakeData = getList()
	}

	componentWillReceiveProps(){
		fakeData = getList()
	}

	deleteBill() {
		if (confirm('Вы уверены, что хотите удалить путевой лист?')) {
			deleteBill(this.state.selectedBill.ID);
			this.updateTable();
		} else {

		}
	}

	// epic shitcode
	// there is no time to do stores
	updateTable() {
		fakeData = getList();
		this.forceUpdate()
	}

	showBill() {
		this.setState({
			showForm:true
		})

	}

	closeBill() {
		this.setState({
			showForm: true
		})

	}


	render() {

		let showCloseBtn = this.state.selectedBill !== null && this.state.selectedBill.STATUS !== 'open';

		return (
			<div className="ets-page-wrap">
				<div className="some-header">Журнал путевых листов
					<div className="waybills-buttons">
						<Button bsSize="small" onClick={this.createBill.bind(this)}><Glyphicon glyph="plus" /> Создать ПЛ</Button>
						<Button bsSize="small" onClick={this.showBill.bind(this)}><Glyphicon glyph="search" /> Просмотреть ПЛ</Button>
						<Button bsSize="small" disabled={showCloseBtn} onClick={this.closeBill.bind(this)}><Glyphicon glyph="ok" /> Закрыть ПЛ</Button>
						<Button bsSize="small" disabled={this.state.selectedBill === null} onClick={this.deleteBill.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
					</div>
				</div>
				<WaybillsTable data={fakeData} onRowSelected={this.selectBill.bind(this)} selected={this.state.selectedBill}/>
				<WaybillFormWrap
						onFormHide={this.onFormHide.bind(this)}
						showForm={this.state.showForm}
						bill={this.state.selectedBill}
						updateTable={this.updateTable.bind(this)}/>
			</div>)
	}
}

let WaybillsTable = (props) => {

		let tableCaptions = [
			"Статус",
			"Номер",
			"Дата выдачи",
			"Водитель",
			"Гос. № ТС",
			"Выезд план.",
			"Выезд факт",
			"Возвращение план",
			"Возвращение факт",
			"Мастер",
			//"Диспетчер"
		]

		let tableCols = [
			"STATUS",
			"ID",
			"DATE_CREATE",
			"DRIVER_ID",
			"CAR_ID",
			"PLAN_DEPARTURE_DATE",
			"PLAN_ARRIVAL_DATE",
			"FACT_DEPARTURE_DATE",
			"FACT_ARRIVAL_DATE",
			"RESPONSIBLE_PERSON_ID"
		];

		const renderers = {
			STATUS: ({data}) => data === 'open' ? <div>Открыт</div> : <div>Закрыт</div>,
			RESPONSIBLE_PERSON_ID: ({data}) => <div>{getFIOById(data)}</div>,
			DRIVER_ID: ({data}) => <div>{getFIOById(data)}</div>,
			CAR_ID: ({data}) => <div>{getCarById(data).gov_number}</div>
		};

		const data = props.data.map( (d, i) => {
			if (!props.selected) return d;
			if (d.ID === props.selected.ID) {
				d.isSelected = true;
			} else {
				d.isSelected = false;
			}
			return d;
		});

		return <Table results={data}
									tableCols={tableCols}
									tableCaptions={tableCaptions}
									renderers={renderers}
									onRowSelected={props.onRowSelected}/>
}
