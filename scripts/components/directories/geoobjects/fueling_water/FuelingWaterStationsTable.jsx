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

let FuelingWaterStationsTable = (props) => {

    const renderers = {

		};

		return <Table
				title='Базы гидрантов'
				results={props.data}
				tableMeta={tableMeta}
				renderers={renderers}
				{...props}/>
}

export default FuelingWaterStationsTable;
