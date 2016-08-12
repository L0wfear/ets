import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'name',
			caption: 'Наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'address',
			caption: 'Адрес',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'liquid_pgm_volume',
			caption: 'Объем жидких ПГМ',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'solid_pgm_volume',
			caption: 'Объем твердых ПГМ',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'pgm_stores_type_name',
			caption: 'Тип ПГМ',
			type: 'number',
      filter: {
        type: 'string',
      }
		}
	]
};

let PGMTable = (props) => {
		return <Table
				title='Пункты отпуска ПГМ'
				results={props.data}
				tableMeta={tableMeta}
				{...props}/>
};

export default PGMTable;
