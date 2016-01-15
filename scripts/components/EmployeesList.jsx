import React, { Component } from 'react';
import { Link } from 'react-router';
import connectToStores from 'flummox/connect';
import Table from './ui/table/DataTable.jsx';
import FilterModal from './ui/table/filter/FilterModal.jsx';
import FilterButton from './ui/table/filter/FilterButton.jsx';
import DriverFormWrap from './drivers/DriverFormWrap.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import ClickOutHandler from 'react-onclickout';

// active: true
// birthday: "1974-01-25T00:00:00.000000Z"
// company_id: 10231494
// drivers_license: "34 ОН 885423"
// first_name: "Валерий"
// id: 16
// isSelected: false
// last_name: "Айсин"
// middle_name: "Александрович"
// personnel_number: 250
// phone: "8-905-391-41-86"
// position_id: 15
// prefer_car: null
// special_license: "34 СЕ 348503"

let tableMeta = {
  cols: [{
      name: 'last_name',
      caption: 'Фамилия',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'first_name',
      caption: 'Имя',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'middle_name',
      caption: 'Отчество',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'birthday',
      caption: 'Дата рождения',
      type: '',
      filter: {
				type: 'date'
			}
  }, {
      name: 'personnel_number',
      caption: 'Табельный номер',
      type: '',
      filter: {}
  }, {
      name: 'drivers_license',
      caption: 'Водительское удостоверение',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'special_license',
      caption: 'Специальное удостоверение',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'active',
      caption: 'Текущее состояние',
      type: 'text',
      filter: {
				type: 'select',
				labelFunction: (l) => l === true ? 'Работает' : 'Не работает'
			}
  }, {
      name: 'phone',
      caption: 'Телефон',
      type: 'text',
      filter: {
				type: 'select'
			}
  }]
};

let EmployeesTable = (props) => {

	const renderers = {
		birthday : ({data}) => <div>{data ? moment(data).format('YYYY-MM-DD') : ''}</div>,
		active : ({data}) => <div>{data === true ? 'Работает' : 'Не работает'}</div>
	}

	return <Table results={props.data}
								tableMeta={tableMeta}
								renderers={renderers}
								{...props}/>
}

class EmployeesList extends Component {


	constructor(props) {
		super(props);

		this.state = {
			filterValues: {},
			filterModalIsOpen: false,
			selectedDriver: null,
			showForm: false,
		};
	}

	componentDidMount() {
		console.log('MOUNT EmployeesList')
		this.context.flux.getActions('employees').getEmployees();
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
		let driver = _.find(this.props.employeesList, d => d.id === id);

		this.setState({
			selectedDriver: driver
		});
	}

	editDriver() {
		this.setState({filterModalIsOpen: false, showForm: true});
	}

	onFormHide() {
		this.setState({showForm: false, selectedDriver: null});
	}

	render() {

		const { driversList = [] } = this.props;
		const drivers = driversList.map( (d) => {
			return {
				value: d.id,
				label: `${d.last_name} ${d.first_name} ${d.middle_name}`,
			}
		});

		return (
			<div className="ets-page-wrap">
				<div className="some-header">Реестр водителей "Жилищник Крылатское"
					<div className="waybills-buttons">
						<ClickOutHandler onClickOut={() => { if (this.state.filterModalIsOpen) { this.setState({filterModalIsOpen: false}) }}}>
							<FilterButton direction={'left'} show={this.state.filterModalIsOpen} active={_.keys(this.state.filterValues).length} onClick={this.toggleFilter.bind(this)}/>
							<FilterModal onSubmit={this.saveFilter.bind(this)}
													 show={this.state.filterModalIsOpen}
													 onHide={() => this.setState({filterModalIsOpen: false})}
													 values={this.state.filterValues}
													 direction={'left'}
													 options={drivers}
													 tableMeta={tableMeta}
													 tableData={driversList}/>
						</ClickOutHandler>
						<Button bsSize="small" onClick={this.editDriver.bind(this)} disabled={this.state.selectedDriver === null}><Glyphicon glyph="pencil" /> Редактировать</Button>
					</div>
				</div>

				<EmployeesTable data={driversList} filter={this.state.filterValues} onRowSelected={this.selectDriver.bind(this)} selected={this.state.selectedDriver} selectField={'id'}/>
				<DriverFormWrap onFormHide={this.onFormHide.bind(this)}
												showForm={this.state.showForm}
												driver={this.state.selectedDriver}/>
			</div>
		)
	}
}

EmployeesList.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(EmployeesList, ['employees']);
