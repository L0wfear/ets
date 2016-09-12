import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'name',
			displayName: 'Полное наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'shortname',
			displayName: 'Краткое наименование',
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
			name: 'productivity',
			displayName: 'Производительность (куб. м в сутки)',
			type: 'number',
      filter: {
        type: 'string',
      }
		}
	]
};

let SSPTable = (props) => {
		return <Table
			title='Мобильные снегоплавильные пункты'
			results={props.data}
			tableMeta={tableMeta}
			{...props}/>
};

export default SSPTable;
