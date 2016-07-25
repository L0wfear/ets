import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'name',
			caption: 'Операция',
			type: 'number',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'equipment',
			caption: 'Для спецоборудования',
			filter: {
				type: 'select',
				labelFunction: (equipment) => equipment ? 'Да' : 'Нет'
			},
			cssClassName: 'width150'
		}
	]
};

let FuelOperationsTable = (props) => {

    const renderers = {
			equipment: ({data}) => <div style={{textAlign: "center"}}><input type="checkbox" checked={!!data} readOnly /></div>,
		};

		return <Table title='Операции для расчета топлива'
									results={props.data}
									tableMeta={tableMeta}
                  renderers={renderers}
									{...props}/>
}

export default FuelOperationsTable;
