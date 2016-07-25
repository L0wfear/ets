import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';
import { datePickerFunction } from 'utils/labelFunctions';

let tableMeta = {
  cols: [
    {
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
				labelFunction: (l) => l ? 'Работает' : 'Не работает'
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

	const renderers = {
		birthday : ({data}) => <DateFormatter date={data} />,
		active : ({data}) => <div>{data === true ? 'Работает' : 'Не работает'}</div>,
		drivers_license : ({data}) => <div>{data && data !== "None" && data !== 'null' ? data : ''}</div>,
		special_license : ({data}) => <div>{data && data !== "None" && data !== 'null' ? data : ''}</div>,
    position_name: ({data}) => <div>{data && data !== "None" && data !== 'null' ? data : ''}</div>,
    medical_certificate_date: ({data}) => <DateFormatter date={data} />,
	};

	return <Table title='Реестр сотрудников'
      results={data}
      tableMeta={tableMeta}
      renderers={renderers}
      initialSort={'full_name'}
      {...props}/>
}

export default EmployeesTable;
