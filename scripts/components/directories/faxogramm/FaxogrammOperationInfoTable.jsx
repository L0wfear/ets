import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

export default (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'tk_operation_name',
				displayName: 'Операция',
				type: 'string',
			},
			{
				name: 'num_exec',
				displayName: 'Количество выполнений',
				type: 'string',
			},
		]
	};

	return <Table title="Реестр факсограмм"
								results={props.data}
								tableMeta={tableMeta}
								{...props}/>
}
