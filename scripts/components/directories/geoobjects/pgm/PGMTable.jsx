import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'name',
			displayName: 'Наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'address',
			displayName: 'Адрес',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'liquid_pgm_volume',
			displayName: 'Объем жидких ПГМ',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'solid_pgm_volume',
			displayName: 'Объем твердых ПГМ',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'pgm_stores_type_name',
			displayName: 'Тип ПГМ',
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
