import React, { Component } from 'react';
import { Link } from 'react-router';
//import Modal from './ui/Modal.jsx';
import Table from './ui/table/DataTable.jsx';
import FilterModal from './ui/table/filter/FilterModal.jsx';
import FilterButton from './ui/table/filter/FilterButton.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';

import EMPLOYEES from '../../mocks/employees.js';

let fakeData = EMPLOYEES;

fakeData = fakeData.filter((e) => {
	return e['Должность'].toLowerCase() === 'водитель';
});

_.each( fakeData, (e) => {
	delete e['Организация'];
	delete e["Класс"];
})

const employees = fakeData.map( (d) => {
	return {
		value: d.id,
		label: d.label,
	}
});

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

let tableMeta = {
  cols: [{
      name: 'Фамилия',
      caption: 'Фамилия',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'Имя',
      caption: 'Имя',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'Отчество',
      caption: 'Отчество',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'Дата рождения',
      caption: 'Дата рождения',
      type: '',
      filter: {
				type: 'date'
			}
  }, {
      name: 'Табельный номер',
      caption: 'Табельный номер',
      type: '',
      filter: {}
  }, {
      name: 'Должность',
      caption: 'Должность',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'Водительское удостоверение',
      caption: 'Водительское удостоверение',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'Специальное удостоверение',
      caption: 'Специальное удостоверение',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'Текущее состояние',
      caption: 'Текущее состояние',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'Телефон',
      caption: 'Телефон',
      type: 'text',
      filter: {
				type: 'select'
			}
  }]
};


export default class EmployeesList extends Component {


	constructor(props) {
		super(props);

		this.state = {
			filterValues: {},
			filterModalIsOpen: false,
		};
	}

	saveFilter(filterValues) {
		console.info(`SETTING FILTER VALUES`, filterValues);
		this.setState({filterValues});
	}

	toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
	}

	render() {

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
				<div className="some-header">Реестр сотрудников "Жилищник Крылатское"
					<div className="waybills-buttons">
						<FilterButton direction={'left'} show={this.state.filterModalIsOpen} active={_.keys(this.state.filterValues).length} onClick={this.toggleFilter.bind(this)}/>
						<FilterModal onSubmit={this.saveFilter.bind(this)}
												 show={this.state.filterModalIsOpen}
												 onHide={() => this.setState({filterModalIsOpen: false})}
												 cols={tableCols}
												 captions={tableCaptions}
												 values={this.state.filterValues}
												 direction={'left'}
												 options={employees}
												 tableMeta={tableMeta}
												 tableData={fakeData}/>
					</div>
				</div>

				<EmployeesTable data={data} onRowSelected={()=>{}}/>
			</div>
		)
	}
}

let EmployeesTable = (props) => {

	return <Table results={props.data}
								tableCols={tableCols}
								tableCaptions={tableCaptions}
								{...props}/>
}
