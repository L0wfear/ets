import React, { Component } from 'react';
import connectToStores from 'flummox/connect';
import Table from '../ui/table/DataTable.jsx';
import DateFormatter from '../ui/DateFormatter.jsx';
import ElementsList from '../ElementsList.jsx';
import EmployeeFormWrap from './EmployeeFormWrap.jsx';
import { Button, Glyphicon } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import { datePickerFunction } from 'utils/labelFunctions';

let tableMeta = {
  cols: [{
      name: 'full_name',
      caption: 'Фамилия Имя Отчество',
      type: 'text',
      cssClassName: "width300justify",
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
      type: 'text',
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
      name: 'company_structure_name',
      caption: 'Подразделение',
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
  }, {
      name: 'medical_certificate',
      caption: 'Медицинская справка',
      type: 'text',
      filter: {
				type: 'select'
			}
  }, {
      name: 'medical_certificate_date',
      caption: 'Срок действия мед. справки',
      type: 'date',
      filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
      }
  }]
};

let EmployeesTable = (props) => {

  let data = props.data;

  let fullnames = data.map((e) => {
    let last_name = e.last_name || '';
    let first_name = e.first_name || '';
    let middle_name = e.middle_name || '';
    return last_name+' '+first_name+' '+middle_name;
  });
  data.forEach((e, i) => {e.full_name = fullnames[i]});
  console.log(data)

	const renderers = {
		birthday : ({data}) => <DateFormatter date={data} />,
		active : ({data}) => <div>{data === true ? 'Работает' : 'Не работает'}</div>,
		drivers_license : ({data}) => <div>{data && data !== "None" && data !== 'null' ? data : ''}</div>,
		special_license : ({data}) => <div>{data && data !== "None" && data !== 'null' ? data : ''}</div>,
    position_name: ({data}) => <div>{data && data !== "None" && data !== 'null' ? data : ''}</div>,
	};

	return <Table title='Реестр сотрудников'
      results={data}
      tableMeta={tableMeta}
      renderers={renderers}
      initialSort={"full_name"}
      {...props}/>
}

class EmployeesList extends ElementsList {


	constructor(props, context) {
		super(props);

    this.mainListName = 'employeesList';
    this.removeElementAction = context.flux.getActions('employees').deleteEmployee;
	}

  componentDidMount() {
    super.componentDidMount();
    this.context.flux.getActions('employees').getEmployees();
    this.context.flux.getActions('objects').getPositions();
  }

	render() {

		const { employeesList = [] } = this.props;

		return (
			<div className="ets-page-wrap">
				<EmployeesTable data={employeesList} onRowSelected={this.selectElement.bind(this)} selected={this.state.selectedElement} selectField={'id'}>
          <Button bsSize="small" onClick={this.createElement.bind(this)}><Glyphicon glyph="plus" /> Создать сотрудника</Button>
          <Button bsSize="small" onClick={this.showForm.bind(this)} disabled={this.state.selectedElement === null}><Glyphicon glyph="pencil" /> Редактировать</Button>
          {/*<Button bsSize="small" disabled={this.state.selectedElement === null} onClick={this.removeElement.bind(this)}><Glyphicon glyph="remove" /> Удалить</Button>*/}
        </EmployeesTable>
				<EmployeeFormWrap onFormHide={this.onFormHide.bind(this)}
            showForm={this.state.showForm}
            element={this.state.selectedElement} />
			</div>
		)
	}
}

EmployeesList.contextTypes = {
	flux: React.PropTypes.object,
};

export default connectToStores(EmployeesList, ['employees', 'objects']);
