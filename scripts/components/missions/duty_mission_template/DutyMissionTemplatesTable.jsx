import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'number',
				displayName: 'Номер',
				type: 'number',
        cssClassName: 'width60'
			},
      {
				name: 'route_name',
				displayName: 'Маршрут',
				type: 'string',
				filter: {
					type: 'select',
				},
			},
      {
				name: 'technical_operation_name',
				displayName: 'Технологическая операция',
				type: 'string',
				filter: {
					type: 'select',
				}
			},
      {
				name: 'comment',
				displayName: 'Комментарий',
				type: 'string',
				filter: {
					type: 'select',
				},
				cssClassName: 'width300'
			},
		]
	};

	return tableMeta;

};


export let DutyMissionTemplatesTable = (props) => {

		return <Table title="Шаблоны наряд-заданий"
									results={props.data}
									tableMeta={getTableMeta(props)}
									initialSort={'number'}
									initialSortAscending={false}
									{...props}/>
}
