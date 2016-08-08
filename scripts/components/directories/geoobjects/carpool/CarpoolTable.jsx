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
			name: 'address',
			caption: 'Адрес',
			type: 'string',
      filter: {
        type: 'select',
      }
		}
	]
};

let CarpoolTable = (props) => {

    const renderers = {};

		return <Table
				title='Автобазы'
				results={props.data}
				tableMeta={tableMeta}
				renderers={renderers}
				{...props}/>
}

export default CarpoolTable;
