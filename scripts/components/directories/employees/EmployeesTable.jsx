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
    },
    {
      name: 'birthday',
      caption: 'Дата рождения',
      type: '',
      filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
			}
    },
    {
      name: 'personnel_number',
      caption: 'Табельный номер',
      type: '',
      filter: {}
    },
    {
      name: 'position_name',
      caption: 'Должность',
      type: 'text',
      filter: {
        type: 'select'
      }
    },
    {
      name: 'drivers_license',
      caption: 'Водительское удостоверение',
      type: 'text',
      filter: {
				type: 'select'
			}
    },
    {
      name: 'special_license',
      caption: 'Специальное удостоверение',
      type: 'text',
      filter: {
				type: 'select'
			}
    },
    {
      name: 'company_structure_name',
      caption: 'Подразделение',
      type: 'text',
      filter: {
				type: 'select'
			}
    },
    {
      name: 'active',
      caption: 'Текущее состояние',
      type: 'text',
      filter: {
				type: 'select',
				labelFunction: (l) => l ? 'Работает' : 'Не работает'
			}
    },
    {
      name: 'phone',
      caption: 'Телефон',
      type: 'text',
      filter: {
				type: 'select'
			}
    },
    {
      name: 'medical_certificate',
      caption: 'Медицинская справка',
      type: 'text',
      filter: {
				type: 'select'
			}
    },
    {
      name: 'medical_certificate_date',
      caption: 'Срок действия мед. справки',
      type: 'date',
      filter: {
        type: 'date_create',
        labelFunction: datePickerFunction
      }
    },
    {
      name: 'snils',
      caption: 'СНИЛС №',
      type: 'text',
      filter: {
        type: 'select'
      }
    }
  ]
};

let EmployeesTable = (props) => {

  let data = props.data;
  data.forEach((e, i) => {
    let last_name = e.last_name || '';
    let first_name = e.first_name || '';
    let middle_name = e.middle_name || '';
    e.full_name = last_name+' '+first_name+' '+middle_name;
  });

	const renderers = {
		birthday : ({data}) => <DateFormatter date={data} />,
		active : ({data}) => <div>{data === true ? 'Работает' : 'Не работает'}</div>,
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
