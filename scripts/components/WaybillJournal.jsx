import { Component } from 'react';
import { Link } from 'react-router';
//import Modal from './ui/Modal.jsx';
import Table from './ui/table/Table.jsx';
import { Button, Glyphicon } from 'react-bootstrap';


import fakeData from '../fakebills.js';

export default class WaybillJournal extends Component {


	constructor(props) {
		super(props);
		this.state = {
			selectedBill: null
		}
	}

	selectBill(id) {
		console.log( 'row selected', id );
		let bill = null;
		_.each(fakeData, function(o){ 
			if ( o.id === id ){
				bill = o;
				console.log( 'bill finded', bill)
			} 
		});



		this.setState({
			selectedBill: bill
		})
	}

	render() {

		let showCloseBtn = this.state.selectedBill !== null && !this.state.selectedBill.status;


		return (
			<div className="ets-page-wrap">
			<div className="some-header">Журнал путевых листов
			<div className="waybills-buttons">
				<Button bsSize="small"><Glyphicon glyph="plus" /> Открыть путевой лист</Button>
				<Button bsSize="small" disabled={showCloseBtn}><Glyphicon glyph="ok" /> Закрыть</Button>
				<Button bsSize="small"><Glyphicon glyph="remove" /> Удалить</Button>
			</div>
			</div>
				<WaybillsTable data={fakeData} onRowSelected={this.selectBill.bind(this)}/>
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
			"Конец, км",
			"Зона"
		]

	return <Table 
					title="Журнал путевых листов" 
					columnCaptions={tableCaptions}
					data={props.data}
					pageSize={10}
					cellRenderers={{ status: (flag) => flag ? 'Открыт' : 'Закрыт'} }
					onRowSelected={props.onRowSelected}/>
}