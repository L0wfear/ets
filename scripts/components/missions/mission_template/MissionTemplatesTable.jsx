import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';

let getTechOperationById = (id) => window.__ETS_CONTAINER__.flux.getStore('objects').getTechOperationById(id);

let getRouteById = (id) => window.__ETS_CONTAINER__.flux.getStore('routes').getRouteById(id);

let getCarById = (id) => window.__ETS_CONTAINER__.flux.getStore('objects').getCarById(id);

let getTableMeta = (props) => {

	let tableMeta = {
		cols: [
			{
				name: 'car_id',
				displayName: 'Рег. номер ТС',
				type: 'number',
				display: false,
				filter: {
					type: 'multiselect',
          labelFunction: (id) => getCarById(id).gov_number || id,
				},
			},
			{
				name: 'number',
				displayName: 'Номер',
				type: 'number',
        cssClassName: 'width60',
				filter: {
					type: 'multiselect',
					labelFunction: (id) => id,
				},
			},
      {
				name: 'name',
				displayName: 'Название',
				type: 'string',
				filter: {
					type: 'select'
				}
			},
      {
				name: 'car_id',
				displayName: 'Рег. номер ТС',
				type: 'number',
				filter: false,
        cssClassName: 'width120',
			},
      {
				name: 'route_id',
				displayName: 'Маршрут',
				type: 'number',
				filter: {
					type: 'select',
          labelFunction: (id) => getRouteById(id).name || id,
				},
        cssClassName: 'width120',
			},
      {
				name: 'passes_count',
				displayName: 'Количество проходов',
				type: 'number',
				filter: {
					type: 'select'
				},
        cssClassName: 'width120'
			},
      {
				name: 'technical_operation_id',
				displayName: 'Технологическая операция',
				type: 'number',
				filter: {
					type: 'select',
          labelFunction: (id) => getTechOperationById(id).name || id,
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

		const renderers = {
			technical_operation_id: ({data}) => <div>{getTechOperationById(data).name || data}</div>,
      route_id: ({data}) => <div>{getRouteById(data).name || data}</div>,
      car_id: ({data}) => <div>{getCarById(data).gov_number || data}</div>,
		};

		return <Table title="Шаблоны заданий"
			results={props.data}
			renderers={renderers}
			tableMeta={getTableMeta(props)}
			initialSort={'number'}
			initialSortAscending={false}
			{...props}/>
}
