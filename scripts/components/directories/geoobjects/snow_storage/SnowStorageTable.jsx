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
		}
	]
};

let SnowStorageTable = (props) => {
		return <Table
				title='Стационарные снегоплавильные пункты'
				results={props.data}
				tableMeta={tableMeta}
				{...props}/>
};

export default SnowStorageTable;
