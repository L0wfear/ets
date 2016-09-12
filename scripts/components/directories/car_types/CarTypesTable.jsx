import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'full_name',
			displayName: 'Полное наименование',
			type: 'string',
      filter: {
        type: 'select',
      },
			cssClassName: 'width300'
		},
		{
			name: 'short_name',
			displayName: 'Краткое наименование',
			type: 'string',
      filter: {
        type: 'select',
      },
			cssClassName: 'width300'
		},
		{
			name: 'plow_width',
			displayName: 'Ширина уборочного оборудования',
			type: 'string',
      filter: false
		}
	]
};

let CarTypesTable = (props) => {
		return <Table
			title='Типы техники'
			results={props.data}
			tableMeta={tableMeta}
			initialSort={'full_name'}
			{...props}/>
}

export default CarTypesTable;
