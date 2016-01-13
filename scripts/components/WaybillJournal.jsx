import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import { Link } from 'react-router';
import { Button, Glyphicon } from 'react-bootstrap';
import ClickOutHandler from 'react-onclickout';
import Table from './ui/table/DataTable.jsx';
import FilterModal from './ui/table/filter/FilterModal.jsx';
import FilterButton from './ui/table/filter/FilterButton.jsx';
import WaybillFormWrap from './WaybillFormWrap.jsx';
import moment from 'moment';
import cx from 'classnames';
import { getCarById } from '../../mocks/krylatskoe_cars.js';
import { getBillById } from '../stores/WaybillStore.js';
import { getFIOById } from '../stores/EmployeesStore.js';

function getStatusLabel(s) {
	return s === 'open' ? 'Открыт' : 'Закрыт';
}

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

let WaybillsTable = (props) => {

		const renderers = {
			STATUS: ({data}) => <div>{getStatusLabel(data)}</div>,
			RESPONSIBLE_PERSON_ID: ({data}) => <div>{getFIOById(data)}</div>,
			DRIVER_ID: ({data}) => <div>{getFIOById(data)}</div>,
			CAR_ID: ({data}) => <div>{getCarById(data).gov_number}</div>
		};

		return <Table results={props.data}
									renderers={renderers}
									tableMeta={tableMeta}
									{...props}/>
}

class WaybillJournal extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedBill: null,
			filterModalIsOpen: false,
			filterValues: {}
		};

		//window.updateBillsJournal = this.updateTable.bind(this);
	}

	selectBill({props}) {
		const id = props.data.ID;
		let bill = _.find(this.props.waybillsList, w => w.ID === id);//();getBillById(id);

		this.setState({ selectedBill: bill });
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
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('waybills').getWaybills();
	}

	componentWillReceiveProps(){
	}

	deleteBill() {
		if (confirm('Вы уверены, что хотите удалить путевой лист?')) {
			//deleteBill(this.state.selectedBill.ID);
			const { flux } = this.context;
			flux.getActions('waybills').removeWaybill(this.state.selectedBill.ID);
			//this.updateTable();
		} else {

		}
	}

	showBill() {
		this.setState({ showForm: true });
	}

	closeBill() {
		this.setState({ showForm: true });
	}

	toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
	}

	saveFilter(filterValues) {
		console.info(`SETTING FILTER VALUES`, filterValues);
		this.setState({filterValues});
	}

	render() {

		console.log(this.props);

		const { waybillsList = [] } = this.props;

		let showCloseBtn = this.state.selectedBill !== null && this.state.selectedBill.STATUS !== 'open';

		return (
			<div className="ets-page-wrap">
				<div className="some-header">Журнал путевых листов
					<div className="waybills-buttons">
						<ClickOutHandler onClickOut={() => { if (this.state.filterModalIsOpen) { this.setState({filterModalIsOpen: false}) }}}>
							<FilterButton direction={'right'} show={this.state.filterModalIsOpen} active={_.keys(this.state.filterValues).length} onClick={this.toggleFilter.bind(this)}/>
							<FilterModal onSubmit={this.saveFilter.bind(this)}
													 show={this.state.filterModalIsOpen}
													 onHide={() => this.setState({filterModalIsOpen: false})}
													 values={this.state.filterValues}
													 direction={'right'}
													 tableMeta={tableMeta}
													 tableData={waybillsList} />
						</ClickOutHandler>
						<Button bsSize="small" onClick={this.createBill.bind(this)}><Glyphicon glyph="plus" /> Создать ПЛ</Button>
						<Button bsSize="small" onClick={this.showBill.bind(this)} disabled={this.state.selectedBill === null}><Glyphicon glyph="search" /> Просмотреть ПЛ</Button>
						<Button bsSize="small" disabled={showCloseBtn} onClick={this.closeBill.bind(this)}><Glyphicon glyph="ok" /> Закрыть ПЛ</Button>
						<Button bsSize="small" disabled={this.state.selectedBill === null} onClick={this.deleteBill.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>
					</div>
				</div>
				<WaybillsTable data={waybillsList} filter={this.state.filterValues} onRowSelected={this.selectBill.bind(this)} selected={this.state.selectedBill}/>
				<WaybillFormWrap onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 bill={this.state.selectedBill}/>
			</div>)
	}
}

WaybillJournal.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(WaybillJournal, ['waybills']);
