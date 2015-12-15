import React, { Component } from 'react';
import { Link } from 'react-router';
//import Modal from './ui/Modal.jsx';
import Table from './ui/table/Table.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import { getCarsByOwnerId } from '../adapter.js';

let CARS = [];
getCarsByOwnerId().then((response)=> {
	CARS = response
});


export default class CarsList extends Component {


	constructor(props) {
		super(props);
	}


	render() {

		return (<div className="ets-page-wrap">
				<div className="some-header">Реестр транспорта "Жилищник Крылатское"</div>
					<CarsTable data={CARS} onRowSelected={()=>{}}/>
			</div>)
	}
}

let CarsTable = (props) => {

		let tableCaptions = [
			"Госномер", "Модель", "Тип"
		]

		let tableCols = ['gov_number', 'model', 'type']

	return <Table 
					columnCaptions={tableCaptions}
					tableCols={tableCols}
					data={props.data}
					pageSize={15}/>
}