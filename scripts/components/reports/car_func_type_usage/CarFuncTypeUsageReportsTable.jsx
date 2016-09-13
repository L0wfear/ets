import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'company_name',
			displayName: 'Учреждение',
			type: 'string',
			filter: {
				type: 'select',
			}
		},
		{
			name: 'func_type',
			displayName: 'Тип техники',
			type: 'string',
			filter: {
        type: 'select',
			},
		},
		{
			name: 'total_cars_count',
			displayName: 'Кол-во техники указанного типа',
			type: 'number',
			filter: {
        type: 'select',
			},
		},
		{
			name: 'technical_operation',
			displayName: 'Технологическая операция',
			type: 'string',
			filter: {
        type: 'select',
			},
		},
		{
			name: 'cars_count',
			displayName: 'Задействованная техника',
			type: 'number',
			filter: {
        type: 'select',
			},
		},
	]
}

export default (props) => {

	const renderers = {
    rowNumber: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    company_name: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    func_type: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
    total_cars_count: (meta) => <div>{meta.rowData.hidden ? '' : meta.data}</div>,
	};

	return <Table title='Статистика выхода техники за период'
								tableMeta={tableMeta}
								results={props.data}
								renderers={renderers}
								enableSort={false}
								{...props} />

}
