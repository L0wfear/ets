import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import DriverFormWrap from './DriverFormWrap.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';

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
		active : ({data}) => <div>{data === true ? 'Работает' : 'Не работает'}</div>,
		drivers_license : ({data}) => <div>{data && data !== "None" && data !== 'null' ? data : ''}</div>,
		special_license : ({data}) => <div>{data && data !== "None" && data !== 'null' ? data : ''}</div>,
	};

	return <Table title='Реестр водителей "Жилищник Крылатское"'
                results={props.data}
								tableMeta={tableMeta}
								renderers={renderers}
								{...props}/>
}

class DriversList extends Component {


	constructor(props) {
		super(props);

		this.state = {
			selectedDriver: null,
			showForm: false,
		};
	}

	componentDidMount() {
		this.context.flux.getActions('employees').getEmployees();
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
				<EmployeesTable data={driversList} onRowSelected={this.selectDriver.bind(this)} selected={this.state.selectedDriver} selectField={'id'}>
          <Button bsSize="small" onClick={this.editDriver.bind(this)} disabled={this.state.selectedDriver === null}><Glyphicon glyph="pencil" /> Редактировать</Button>
        </EmployeesTable>
				<DriverFormWrap onFormHide={this.onFormHide.bind(this)}
												showForm={this.state.showForm}
												driver={this.state.selectedDriver}/>
			</div>
		)
	}
}

DriversList.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(DriversList, ['employees']);
