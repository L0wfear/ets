import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'name',
			displayName: 'Операция',
			type: 'number',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'equipment',
			displayName: 'Для спецоборудования',
			filter: {
				type: 'select',
				labelFunction: (equipment) => equipment ? 'Да' : 'Нет'
			},
			cssClassName: 'width150'
		}
	]
};

export default (props) => {

    const renderers = {
			equipment: ({data}) => <div style={{textAlign: "center"}}><input type="checkbox" checked={!!data} readOnly /></div>,
		};

		return <Table title='Операции для расчета топлива'
									results={props.data}
									tableMeta={tableMeta}
                  renderers={renderers}
									{...props}/>
}
