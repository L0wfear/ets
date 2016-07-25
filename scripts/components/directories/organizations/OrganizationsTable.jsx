import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'asuods_id',
			caption: 'ID организации',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'name',
			caption: 'Наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'short_name',
			caption: 'Краткое наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'ogrn',
			caption: 'ОГРН',
			type: 'string',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'inn',
			caption: 'ИНН',
			type: 'string',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'postal_address',
			caption: 'Почтовый адрес',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'email',
			caption: 'Электронный адрес',
			type: 'string',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'phone',
			caption: 'Телефон',
			type: 'string',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'fax',
			caption: 'Факс',
			type: 'string',
      filter: {
        type: 'string',
      }
		},
	]
};

let OrganizationsTable = (props) => {

		return <Table
				title='Организации'
				results={props.data}
				tableMeta={tableMeta}
				{...props}/>
}

export default OrganizationsTable;
