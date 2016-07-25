import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'name',
			caption: 'Полное наименование',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'shortname',
			caption: 'Краткое наименование',
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
			name: 'productivity',
			caption: 'Производительность (куб. м в сутки)',
			type: 'number',
      filter: {
        type: 'string',
      }
		}
	]
};

let SSPTable = (props) => {
		return <Table
			title='Стационарные снегоплавильные пункты'
			results={props.data}
			tableMeta={tableMeta}
			{...props}/>
};

export default SSPTable;
