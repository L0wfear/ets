import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let tableMeta = {
	cols: [
		{
			name: 'address_comm',
			caption: 'Адрес',
			type: 'string',
      filter: {
        type: 'select',
      }
		},
		{
			name: 'roadway_area',
			caption: 'Площадь на проезжей части, м²',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'sidewalk_area',
			caption: 'Площадь на тротуаре, м²',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
		{
			name: 'sidelines_area',
			caption: 'Площадь на обочинах, м²',
			type: 'number',
      filter: {
        type: 'string',
      }
		},
	]
};

let DangerZonesTable = (props) => {

    const renderers = {};

		return <Table
				title='Особо опасные места'
				results={props.data}
				tableMeta={tableMeta}
				renderers={renderers}
				{...props}/>
}

export default DangerZonesTable;
