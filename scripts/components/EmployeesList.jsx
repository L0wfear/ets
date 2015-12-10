import React, { Component } from 'react';
import { Link } from 'react-router';
//import Modal from './ui/Modal.jsx';
import Table from './ui/table/Table.jsx';
import { Button, Glyphicon } from 'react-bootstrap';

import fakeData from '../../mocks/employees.js';

_.each( fakeData, (e) => {
	delete e['Организация'];
	delete e["Класс"];
})


export default class EmployeesList extends Component {


	constructor(props) {
		super(props);
	}


	render() {

		return (
			<div className="ets-page-wrap">
			<div className="some-header">Реестр сотрудников "Жилищник Крылатское"
			<div className="waybills-buttons">
			</div>
			</div>
				<EmployeesTable data={fakeData} onRowSelected={()=>{}}/>
			</div>)
	}
}

let EmployeesTable = (props) => {

		let tableCaptions = [
			"Фамилия", 
			"Имя", 
			"Отчество", 
			"Дата рождения", 
			"Табельный номер", 
			"Должность", 
			"Водительское удостоверение", 
			"Специальное удостоверение",
			"Текущее состояние",
			"Телефон",
		]

		let tableCols = ['Фамилия',
		'Имя', 
		'Отчество', 
		'Дата рождения', 
		'Табельный номер', 
		'Должность', 
		'Водительское удостоверение',
		'Специальное удостоверение',
		'Текущее состояние',
		'Телефон'];

	return <Table 
					columnCaptions={tableCaptions}
					data={props.data}
					tableCols={tableCols}
					pageSize={10}/>
}