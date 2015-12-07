import { Component } from 'react';
import { Link } from 'react-router';
//import Modal from './ui/Modal.jsx';
import Table from './ui/table/Table.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import WaybillForm from './WaybillForm.jsx';
import {makeDate, makeTime} from '../utils/dates.js';


import { getList, getLastNumber, createBill, getBillById } from '../stores/WaybillStore.js';
import { getFIOById } from '../stores/EmployeesStore.js';

let fakeData = getList();

export default class WaybillJournal extends Component {


	constructor(props) {
		super(props);
		this.state = {
			selectedBill: null,
			formState: {
				number: getLastNumber() + 1,
				driver_id: "",
				master_id: ""
			}
		}
	}

	selectBill(id) {
		console.log( 'row selected', id );
		let bill = null;
		_.each(fakeData, function(o) {
			if (o.id === id ){
				bill = o;
				console.log( 'bill finded', bill)
			} 
		});

		this.setState({
			selectedBill: bill
		})
	}

	getDefaultBill() {

		let now = new Date();
		let vyezd_plan = new Date( 
	    now.getFullYear(),
	    now.getMonth(),
	    now.getDate(),
	    9,
	    0
    );
		let vozvr_plan = new Date( 
	    now.getFullYear(),
	    now.getMonth(),
	    now.getDate()+1,
	    9,
	    0
    )
		return {
		    id: getLastNumber() + 1,
		    status: null,
		    number: getLastNumber() + 1,
		    creation_date: makeDate(now) + ' ' + makeTime(now), 
		    master_id: "",
		    vyezd_plan: vyezd_plan,
		    vyezd_fakt: vyezd_plan,
		    vozvr_plan: vozvr_plan,
		    vozvr_fakt: vozvr_plan,
		    driver_id: null,
		    auto: "",
		    route_id: "",
		    fuel_type: 1,
		    fuel_nachalo: "",
		    fuel_vydat: "",
		    fuel_vydano: "",
		    fuel_konec: "",
		    ezdok: "",
				odometr_nachalo: "",
				odometr_konec: "",
				motoch_nachalo: "",
				motoch_konec: "",
				motoch_obor_nachalo: "",
				motoch_obor_konec: "App.jsx"
		}
	}

	createBill() {
		this.setState({
			showForm: true,
			selectedBill: null,
			formState: this.getDefaultBill()
		})
	}

	onFormHide() {
		this.setState({
			showForm: false,
			selectedBill: null
		})
	}

	closeBill() {
		this.setState({
			showForm:true,
			formState:getBillById(this.state.selectedBill.id)
		})
	}

	handleFormStateChange(field, e) {
		console.log( 'waybill form changed', field, e)

		let _formState = this.state.formState;
		_formState[field] = !!e.target ? e.target.value : e;

		if (field === 'odometr_konec') {
			_formState.odometr_probeg = _formState.odometr_konec - _formState.odometr_nachalo;
		}
		if (field === 'motoch_konec') {
			_formState.motoch_probeg = _formState.motoch_konec - _formState.motoch_nachalo;
		}
		if (field === 'motoch_obor_konec') {
			_formState.motoch_obor_probeg = _formState.motoch_obor_konec - _formState.motoch_obor_nachalo;
		}
		this.setState({
			formState:_formState
		})
	}

	handleFormSubmit( formState) {
		let billStatus = formState.status;
		if (billStatus === null ){
			console.log('creating new bill')
			createBill(formState);
			this.setState({
				showForm: false
			})
		} else if (billStatus) {
			console.log('updating bill')
		} else {
			console.log('xz')
		}
	}

	render() {

		let showCloseBtn = this.state.selectedBill !== null && !this.state.selectedBill.status;

		return (
			<div className="ets-page-wrap">
				<div className="some-header">Журнал путевых листов
					<div className="waybills-buttons">
						<Button bsSize="small" onClick={this.createBill.bind(this)}><Glyphicon glyph="plus" /> Открыть путевой лист</Button>
						<Button bsSize="small" disabled={showCloseBtn} onClick={this.closeBill.bind(this)}><Glyphicon glyph="ok" /> Закрыть</Button>
						<Button bsSize="small"><Glyphicon glyph="remove" /> Удалить</Button>
					</div>
				</div>
				<WaybillsTable data={fakeData} onRowSelected={this.selectBill.bind(this)}/>
				<WaybillForm onSubmit={this.handleFormSubmit.bind(this)}handleFormStateChange={this.handleFormStateChange.bind(this)} formState={this.state.formState} show={this.state.showForm} onHide={this.onFormHide.bind(this)}/>
			</div>)
	}
}

let WaybillsTable = (props) => {

		let tableCaptions = [
			"Статус", 
			"Номер", 
			"Дата ПЛ", 
			"Мастер", 
			"Выезд план.", 
			"Выезд факт", 
			"Возвращение план", 
			"Возвращение факт", 
			"Водитель",
			"Автомобиль",
			"Маршрут",
			"Ездок",
			"Начало, км",
			"Конец, км"
		]

	let tableData = [];
	let tableCols = [ 
	"status","id",
	"creation_date",
	"master_id",
	"vyezd_plan",
	"vyezd_fakt",
	"vozvr_plan",
	"vozvr_fakt",
	"driver_id", 
	"auto", 
	"route_id", 
	"ezdok", 
	"nachalo",
	"konez"]

	_.each(props.data, (bill)=> {
			let _bill = _.clone(bill);
			let deleteFlag = false;
			_.each( _bill, (v,k) => {
				if (tableCols.indexOf(k) === -1 ) {
					//console.log( 'deleting key', k)
					delete _bill[k];
					deleteFlag = true;

				}
			})
			/*if (deleteFlag) {
				console.log( 'result bill row', _bill)
			}*/
			tableData.push(_bill);
	})

	return <Table 
					title="Журнал путевых листов" 
					columnCaptions={tableCaptions}
					data={tableData}
					tableCols={tableCols}
					pageSize={10}
					cellRenderers={
						{ status: (flag) => flag ? 'Открыт' : 'Закрыт' ,
							master_id: (id) => getFIOById(id),
							driver_id: (id) => getFIOById(id)}
					 }
					onRowSelected={props.onRowSelected}/>
}