import React, { Component } from 'react';
import { Link } from 'react-router';
//import Modal from './ui/Modal.jsx';
//import Table from './ui/table/Table.jsx';
import Table from './ui/table/DataTable.jsx';
import FilterModal from './ui/table/filter/FilterModal.jsx';
import FilterButton from './ui/table/filter/FilterButton.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import WaybillForm from './WaybillForm.jsx';
import {makeDate, makeTime} from '../utils/dates.js';
import moment from 'moment';
import cx from 'classnames';
import ClickOutHandler from 'react-onclickout';
import { getCarById } from '../../mocks/krylatskoe_cars.js';

import WaybillFormWrap from './WaybillFormWrap.jsx';
import { getList, getLastNumber, createBill, getBillById, getStatusLabel, updateBill, deleteBill } from '../stores/WaybillStore.js';
import { getFIOById } from '../stores/EmployeesStore.js';


let fakeData = getList();

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

let tableMeta = {
	cols: [
		{
			name: 'STATUS',
			caption: 'Статус',
			type: 'text',
			filter: {
				type: 'select',
				labelFunction: getStatusLabel
			}
		},
		{
			name: 'ID',
			caption: 'Номер',
			type: 'number',
		},
		{
			name: 'DATE_CREATE',
			caption: 'Дата выдачи',
			type: 'date',
		},
		{
			name: 'DRIVER_ID',
			caption: 'Водитель',
			type: 'text',
			filter: 'select'
		},
		{
			name: 'CAR_ID',
			caption: 'Гос. № ТС',
			type: 'text',
		},
		{
			name: 'PLAN_DEPARTURE_DATE',
			caption: 'Выезд план.',
			type: 'date',
		},
		{
			name: 'PLAN_ARRIVAL_DATE',
			caption: 'Возвращение план',
			type: 'date',
		},
		{
			name: 'FACT_DEPARTURE_DATE',
			caption: 'Выезд факт',
			type: 'date',
		},
		{
			name: 'FACT_ARRIVAL_DATE',
			caption: 'Возвращение факт',
			type: 'date',
		},
		{
			name: 'RESPONSIBLE_PERSON_ID',
			caption: 'Мастер',
			type: 'text',
			filter: {
				type: 'select',
				labelFunction: getFIOById
			}
		},
	]
};

export default class WaybillJournal extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedBill: null,
			filterModalIsOpen: false,
			filterValues: {}
		};

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
	//	console.log(this.context.router.getCurrentParams());
		fakeData = getList();
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

	toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
	}

	saveFilter(filterValues) {
		console.info(`SETTING FILTER VALUES`, filterValues);
		this.setState({filterValues});
	}

	render() {

		let showCloseBtn = this.state.selectedBill !== null && this.state.selectedBill.STATUS !== 'open';

		const data = _.filter(fakeData, (obj) => {
			let isValid = true;

			_.mapKeys(this.state.filterValues, (value, key) => {

				if (typeof value.getMonth === 'function') {
					if (obj[key] !== moment(value).format('YYYY-MM-DD H:mm')) {
						isValid = false;
					}
				} else {
					if (obj[key] != value) {
						isValid = false;
					}
				}
			});

			return isValid;
		});

		return (
			<div className="ets-page-wrap">
				<div className="some-header">Журнал путевых листов
					<div className="waybills-buttons">
						<ClickOutHandler onClickOut={() => this.setState({filterModalIsOpen: false})}>
							<FilterButton direction={'right'} show={this.state.filterModalIsOpen} active={_.keys(this.state.filterValues).length} onClick={this.toggleFilter.bind(this)}/>
							<FilterModal onSubmit={this.saveFilter.bind(this)}
													 show={this.state.filterModalIsOpen}
													 onHide={() => this.setState({filterModalIsOpen: false})}
													 cols={tableCols}
													 captions={tableCaptions}
													 values={this.state.filterValues}
													 direction={'right'}
													 tableMeta={tableMeta}
													 tableData={fakeData} />
						</ClickOutHandler>
						<Button bsSize="small" onClick={this.createBill.bind(this)}><Glyphicon glyph="plus" /> Создать ПЛ</Button>
						<Button bsSize="small" onClick={this.showBill.bind(this)} disabled={this.state.selectedBill === null}><Glyphicon glyph="search" /> Просмотреть ПЛ</Button>
						<Button bsSize="small" disabled={showCloseBtn} onClick={this.closeBill.bind(this)}><Glyphicon glyph="ok" /> Закрыть ПЛ</Button>
						<Button bsSize="small" disabled={this.state.selectedBill === null} onClick={this.deleteBill.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
					</div>
				</div>
				<WaybillsTable data={data} onRowSelected={this.selectBill.bind(this)} selected={this.state.selectedBill}/>
				<WaybillFormWrap
						onFormHide={this.onFormHide.bind(this)}
						showForm={this.state.showForm}
						bill={this.state.selectedBill}
						updateTable={this.updateTable.bind(this)}/>
			</div>)
	}
}

let WaybillsTable = (props) => {

		const renderers = {
			STATUS: ({data}) => <div>{getStatusLabel(data)}</div>,
			RESPONSIBLE_PERSON_ID: ({data}) => <div>{getFIOById(data)}</div>,
			DRIVER_ID: ({data}) => <div>{getFIOById(data)}</div>,
			CAR_ID: ({data}) => <div>{getCarById(data).gov_number}</div>
		};

		return <Table results={props.data}
									tableCols={tableCols}
									tableCaptions={tableCaptions}
									renderers={renderers}
									tableMeta={tableMeta}
									{...props}/>
}
