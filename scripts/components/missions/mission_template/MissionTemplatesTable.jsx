import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'number',
				displayName: 'Номер',
				type: 'number',
        cssClassName: 'width60',
				filter: {
					type: 'multiselect'
				},
			},
      {
				name: 'name',
				displayName: 'Название',
				type: 'string',
				filter: {
					type: 'multiselect'
				}
			},
      {
				name: 'car_gov_number',
				displayName: 'Рег. номер ТС',
				type: 'number',
				filter: {
					type: 'multiselect'
				},
        cssClassName: 'width120',
			},
      {
				name: 'route_name',
				displayName: 'Маршрут',
				type: 'number',
				filter: {
					type: 'multiselect'
				},
        cssClassName: 'width120',
			},
      {
				name: 'passes_count',
				displayName: 'Количество проходов',
				type: 'number',
				filter: {
					type: 'multiselect'
				},
        cssClassName: 'width120'
			},
      {
				name: 'technical_operation_name',
				displayName: 'Технологическая операция',
				type: 'number',
				filter: {
					type: 'multiselect'
				}
			},
      {
				name: 'comment',
				displayName: 'Комментарий',
				type: 'string',
				filter: false
			}
		]
	};

	return tableMeta;
};


export let MissionTemplatesTable = (props) => {

		return <Table title="Шаблоны заданий"
			results={props.data}
			tableMeta={getTableMeta(props)}
			initialSort={'number'}
			initialSortAscending={false}
			{...props}/>
}
