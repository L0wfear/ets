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
