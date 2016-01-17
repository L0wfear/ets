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
import LoadingPage from './LoadingPage.jsx';
//import { getFIOById } from '../stores/EmployeesStore.js';

function getFIOById(data, id) {
	let result = '';

	_.each(data, (v) => {
		if ( v.id === id) {
			result = v['last_name'] + ' '+ v['first_name'][0]+'.'+v['middle_name'][0];
		}
	});

	return result;
}

function getStatusLabel(s) {
	return s === 'open' ? 'Открыт' : 'Закрыт';
}

let tableMeta = {
	cols: [
		{
			name: 'status',
			caption: 'Статус',
			type: 'text',
			filter: {
				type: 'select',
				labelFunction: getStatusLabel
			}
		},
		{
			name: 'id',
			caption: 'Номер',
			type: 'number',
		},
		{
			name: 'date_create',
			caption: 'Дата выдачи',
			type: 'date',
		},
		{
			name: 'driver_id',
			caption: 'Водитель',
			type: 'text',
			filter: 'select'
		},
		{
			name: 'car_id',
			caption: 'Гос. № ТС',
			type: 'text',
		},
		// {
		// 	name: 'plan_departure_date',
		// 	caption: 'Выезд план.',
		// 	type: 'date',
		// },
		// {
		// 	name: 'plan_arrival_date',
		// 	caption: 'Возвращение план',
		// 	type: 'date',
		// },
		{
			name: 'fact_departure_date',
			caption: 'Выезд факт',
			type: 'date',
		},
		{
			name: 'fact_arrival_date',
			caption: 'Возвращение факт',
			type: 'date',
		},
		{
			name: 'responsible_person_id',
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
			status: ({data}) => <div>{getStatusLabel(data)}</div>,
			responsible_person_id: ({data}) => <div>{getFIOById(props.employeesList, data)}</div>,
			driver_id: ({data}) => <div>{getFIOById(props.employeesList, data)}</div>,
			car_id: ({data}) => <div>{_.find(props.carsList, c => c.asuods_id === data).gov_number}</div>,
			date_create: ({data}) => <div>{moment(data).format('YYYY-MM-DD')}</div>,
			fact_departure_date: ({data}) => <div>{moment(data).format('YYYY-MM-DD HH:mm')}</div>,
			fact_arrival_date: ({data}) => <div>{moment(data).format('YYYY-MM-DD HH:mm')}</div>,
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
			filterValues: {},
			loading: true,
		};

		//window.updateBillsJournal = this.updateTable.bind(this);
	}

	selectBill({props}) {
		const id = props.data.id;
		let bill = _.find(this.props.waybillsList, w => w.id === id);

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
			selectedBill: null,
		})
	}

	componentDidMount() {
		const { flux } = this.context;
		flux.getActions('waybills').getWaybills().then( () => {
			this.setState({loading: false});
		});
	}

	componentWillReceiveProps(){
	}

	deleteBill() {
		if (confirm('Вы уверены, что хотите удалить путевой лист?')) {
			const { flux } = this.context;
			flux.getActions('waybills').removeWaybill(this.state.selectedBill.id);
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
		if (this.state.loading) {
			 return <LoadingPage loaded={this.state.loading}/>;
		}

		const { waybillsList = [] } = this.props;

		let showCloseBtn = this.state.selectedBill !== null && this.state.selectedBill.status !== 'open';

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
				<WaybillsTable data={waybillsList} filter={this.state.filterValues} onRowSelected={this.selectBill.bind(this)} selected={this.state.selectedBill} selectField={'id'} {...this.props}/>
				<WaybillFormWrap onFormHide={this.onFormHide.bind(this)}
												 showForm={this.state.showForm}
												 bill={this.state.selectedBill}
												 waybillsList={this.props.waybillsList}/>
			</div>)
	}
}

WaybillJournal.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(WaybillJournal, ['waybills', 'objects', 'employees']);
