import React, { Component } from 'react';
import { Link } from 'react-router';
//import Modal from './ui/Modal.jsx';
import Table from './ui/table/DataTable.jsx';
import FilterModal from './ui/table/filter/FilterModal.jsx';
import FilterButton from './ui/table/filter/FilterButton.jsx';
import DriverFormWrap from './drivers/DriverFormWrap.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';

import ClickOutHandler from 'react-onclickout';

import EMPLOYEES from '../../mocks/employees.js';
import { getEmployeeById } from '../stores/EmployeesStore.js';

let fakeData = EMPLOYEES;

fakeData = fakeData.filter((e) => {
	return e['Должность'].toLowerCase() === 'водитель';
});

_.each( fakeData, (e) => {
	//delete e['Организация'];
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
			selectedDriver: null,
			showForm: false,
		};
	}

	saveFilter(filterValues) {
		console.info(`SETTING FILTER VALUES`, filterValues);
		this.setState({filterValues});
	}

	toggleFilter() {
		this.setState({filterModalIsOpen: !!!this.state.filterModalIsOpen});
	}

	handleClickOutside(){
    this.setState({filterModalIsOpen: false});
  }

	selectDriver({props}) {
		const id = props.data.id;
		let driver = getEmployeeById(id);

		this.setState({
			selectedDriver: driver
		});
	}

	editDriver() {
		this.setState({filterModalIsOpen: false, showForm: true});
	}

	onFormHide() {
		this.setState({showForm: false});
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
				<div className="some-header">Реестр водителей "Жилищник Крылатское"
					<div className="waybills-buttons">
						<ClickOutHandler onClickOut={() => this.setState({filterModalIsOpen: false})}>
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
						</ClickOutHandler>
						<Button bsSize="small" onClick={this.editDriver.bind(this)} disabled={this.state.selectedDriver === null}><Glyphicon glyph="pencil" /> Редактировать</Button>
					</div>
				</div>

				<EmployeesTable data={data} onRowSelected={this.selectDriver.bind(this)} selected={this.state.selectedDriver} selectField={'id'}/>
				<DriverFormWrap onFormHide={this.onFormHide.bind(this)}
												showForm={this.state.showForm}
												driver={this.state.selectedDriver}/>
			</div>
		)
	}
}

let EmployeesTable = (props) => {

	const renderers = {
		'Дата рождения': ({data}) => <div>{moment(data).format('YYYY-MM-DD H:mm')}</div>,
	}

	return <Table results={props.data}
								tableCols={tableCols}
								tableCaptions={tableCaptions}
								renderers={renderers}
								{...props}/>
}
