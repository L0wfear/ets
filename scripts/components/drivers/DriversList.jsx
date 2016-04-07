import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import DateFormatter from '../ui/DateFormatter.jsx';
import ElementsList from '../ElementsList.jsx';
import DriverFormWrap from './DriverFormWrap.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import { datePickerFunction } from 'utils/labelFunctions';

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
        type: 'date_create',
        labelFunction: datePickerFunction
			}
  }, {
      name: 'personnel_number',
      caption: 'Табельный номер',
      type: '',
      filter: {}
  }, {
      name: 'position_name',
      caption: 'Должность',
      type: '',
      filter: {
        type: 'select'
      }
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

let DriversTable = (props) => {

	const renderers = {
		birthday : ({data}) => <DateFormatter date={data} />,
		active : ({data}) => <div>{data === true ? 'Работает' : 'Не работает'}</div>,
		drivers_license : ({data}) => <div>{data && data !== "None" && data !== 'null' ? data : ''}</div>,
		special_license : ({data}) => <div>{data && data !== "None" && data !== 'null' ? data : ''}</div>,
	};

	return <Table title='Реестр сотрудников "Жилищник Крылатское"'
                results={props.data}
								tableMeta={tableMeta}
								renderers={renderers}
								{...props}/>
}

class DriversList extends ElementsList {


	constructor(props) {
		super(props);

    this.mainListName = 'driversList';
	}

  componentDidMount() {
    super.componentDidMount();
    this.context.flux.getActions('employees').getEmployees();
    this.context.flux.getActions('objects').getPositions();
  }

	render() {

		const { driversList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<DriversTable data={driversList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
          <Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать сотрудника</Button>
          <Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="pencil" /> Редактировать</Button>
        </DriversTable>
				<DriverFormWrap onFormHide={this.onFormHide.bind(this)}
												showForm={this.state.showForm}
												driver={this.state.selectedElement}
                        />
			</div>
		)
	}
}

DriversList.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(DriversList, ['employees', 'objects']);
